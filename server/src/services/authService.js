import bcrypt from "bcrypt";
import crypto from "crypto";
import AppError from "../utils/AppError.js";
import {
  accessToken,
  digest,
  randomToken,
  refreshToken,
  tempToken,
  verifyRefreshToken,
  verifyTempToken,
} from "../utils/tokens.js";
import * as repository from "../repositories/authRepository.js";
import { sendOtpEmail, sendMail } from "./mailer.js";

const publicUser = (user) => ({
  id: user.id || user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const fingerprint = (req) =>
  digest(`${req.cookies?.device_id || "new"}:${req.get("user-agent") || "unknown"}`);

const deviceId = () => randomToken();
const sessionContext = (req) => ({ userAgent: req.get?.("user-agent") || req.headers?.["user-agent"] || "", ip: req.ip || req.connection?.remoteAddress || "" });

export function getDeviceId(req) {
  return (
    req.cookies?.trusted_device_id ||
    req.cookies?.device_id ||
    req.headers?.["x-device-id"] ||
    null
  );
}

export function isTrustedDevice(user, req) {
  const currentDeviceId = getDeviceId(req);
  if (!currentDeviceId || !user.trustedDevices || user.trustedDevices.length === 0) {
    return false;
  }
  return user.trustedDevices.some((d) => d.deviceId === currentDeviceId);
}

export async function markDeviceTrusted(user, req, customDeviceId = null) {
  const currentDeviceId = customDeviceId || getDeviceId(req);
  if (!currentDeviceId) return null;

  const userAgent = req.get?.("user-agent") || req.headers?.["user-agent"] || "";
  const ip = req.ip || req.connection?.remoteAddress || "";

  if (!user.trustedDevices) {
    user.trustedDevices = [];
  }

  const existing = user.trustedDevices.find((d) => d.deviceId === currentDeviceId);
  if (existing) {
    existing.lastUsedAt = new Date();
    existing.ip = ip;
    existing.userAgent = userAgent;
  } else {
    user.trustedDevices.push({
      deviceId: currentDeviceId,
      userAgent,
      ip,
      verifiedAt: new Date(),
      lastUsedAt: new Date(),
    });
  }

  await repository.saveUser(user);
  return currentDeviceId;
}

async function issueSession(user, req) {
  const session = await repository.createSession({
    userId: user.id || user._id,
    refreshTokenHash: "pending",
    expiresAt: new Date(Date.now() + 604800000), // 7 days
    ...sessionContext(req),
  });

  const refresh = refreshToken(user, session.id);
  session.refreshTokenHash = digest(refresh);
  await repository.saveSession(session);

  const access = accessToken(user, session.id);
  return {
    access,
    token: access, // alias for client compatibility
    refresh,
    user: publicUser(user),
  };
}

export async function signup({ email, name, password }, req) {
  if (await repository.findUserByEmail(email)) {
    throw new AppError(409, "EMAIL_IN_USE", "An account already exists for this email address.");
  }
  const user = await repository.createUser({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });
  await markDeviceTrusted(user, req);
  return issueSession(user, req);
}

export async function login({ email, password }, req) {
  const user = await repository.findUserByEmail(email, true);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  // Enforce 2FA for SuperAdmin & Editor ONLY on unrecognized/new devices
  if (["editor", "superadmin"].includes(user.role)) {
    if (isTrustedDevice(user, req)) {
      await markDeviceTrusted(user, req);
      const session = await issueSession(user, req);
      return {
        require2FA: false,
        user: session.user,
        token: session.access,
        access: session.access,
        refresh: session.refresh,
      };
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const device = fingerprint(req);
    const challenge = await repository.createChallenge({
      userId: user.id || user._id,
      codeHash: await bcrypt.hash(code, 12),
      fingerprint: device,
      expiresAt: new Date(Date.now() + 600000), // 10 mins
    });

    const token2FA = tempToken(user, challenge.id);

    // Save OTP & tempToken directly on User schema for resilience
    user.otp = await bcrypt.hash(code, 12);
    user.otpExpires = new Date(Date.now() + 600000);
    user.tempToken = token2FA;
    await repository.saveUser(user);

    const emailResult = await sendOtpEmail({
      to: user.email,
      code,
      role: user.role === "superadmin" ? "SuperAdmin" : "Editor",
    });

    if (!emailResult.success) {
      throw new AppError(
        503,
        "EMAIL_UNAVAILABLE",
        "Email delivery service unavailable. Please check Brevo credentials."
      );
    }

    return {
      require2FA: true,
      requiresOtp: true, // legacy alias
      email: user.email,
      tempToken: token2FA,
      challengeId: challenge.id,
      message: "A 6-digit verification code has been sent to your email.",
    };
  }

  // Regular user login (no 2FA required)
  const session = await issueSession(user, req);
  return {
    require2FA: false,
    user: session.user,
    token: session.access,
    access: session.access,
    refresh: session.refresh,
  };
}

export async function verifyOtp({ challengeId, tempToken: tToken, code, otp, email }, req) {
  const codeToVerify = String(code || otp || "").trim();
  if (!codeToVerify) {
    throw new AppError(400, "INVALID_OTP", "Please provide a 6-digit verification code.");
  }

  let effectiveChallengeId = challengeId;
  let userIdFromToken = null;

  if (tToken) {
    try {
      const payload = verifyTempToken(tToken);
      if (payload?.cid) effectiveChallengeId = payload.cid;
      if (payload?.sub) userIdFromToken = payload.sub;
    } catch {
      if (!effectiveChallengeId) {
        throw new AppError(400, "INVALID_2FA_SESSION", "Your 2FA verification session has expired. Please sign in again.");
      }
    }
  }

  if (!effectiveChallengeId && email) {
    const user = await repository.findUserByEmail(email);
    if (user) {
      const latestChallenge = await repository.findChallengeByUserId(user.id || user._id);
      if (latestChallenge) effectiveChallengeId = latestChallenge.id;
      userIdFromToken = user.id || user._id;
    }
  }

  let user = null;

  if (effectiveChallengeId) {
    const challenge = await repository.findChallenge(effectiveChallengeId);
    if (challenge) {
      if (challenge.expiresAt <= new Date() || challenge.consumedAt) {
        throw new AppError(400, "INVALID_OTP", "The verification code is invalid or has expired.");
      }

      // Brute-force lockout: max 5 failed attempts per challenge
      const MAX_OTP_ATTEMPTS = 5;
      if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
        challenge.consumedAt = new Date();
        await repository.saveChallenge(challenge);
        throw new AppError(429, "OTP_LOCKED", "Too many incorrect attempts. Please sign in again to receive a new code.");
      }

      const matches = await bcrypt.compare(codeToVerify, challenge.codeHash);
      if (!matches) {
        challenge.attempts += 1;
        await repository.saveChallenge(challenge);
        const remaining = MAX_OTP_ATTEMPTS - challenge.attempts;
        throw new AppError(
          400,
          "INVALID_OTP",
          remaining > 0
            ? `The verification code is incorrect. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Too many incorrect attempts. Please sign in again."
        );
      }

      challenge.consumedAt = new Date();
      await repository.saveChallenge(challenge);
      user = (await challenge.populate("userId")).userId;
    }
  }

  // Fallback: check User model directly
  if (!user && userIdFromToken) {
    const candidateUser = await repository.findUserById(userIdFromToken);
    if (candidateUser && candidateUser.otp && candidateUser.otpExpires && candidateUser.otpExpires > new Date()) {
      const matches = await bcrypt.compare(codeToVerify, candidateUser.otp);
      if (matches) {
        user = candidateUser;
      }
    }
  }

  if (!user) {
    throw new AppError(400, "INVALID_OTP", "Invalid or expired verification code. Please sign in again.");
  }

  // Generate unique 32-byte cryptographic Device ID
  const newDeviceId = crypto.randomBytes(32).toString("hex");
  const userAgent = req.headers?.["user-agent"] || req.get?.("user-agent") || "";
  const ip = req.ip || req.connection?.remoteAddress || "";

  if (!user.trustedDevices) {
    user.trustedDevices = [];
  }

  user.trustedDevices.push({
    deviceId: newDeviceId,
    userAgent,
    ip,
    verifiedAt: new Date(),
    lastUsedAt: new Date(),
  });

  user.otp = undefined;
  user.otpExpires = undefined;
  user.tempToken = undefined;
  await repository.saveUser(user);

  const session = await issueSession(user, req);
  return {
    ...session,
    newDeviceId,
  };
}

export async function resendOtp({ challengeId, tempToken: tToken, email }, req) {
  let user = null;

  if (tToken) {
    try {
      const payload = verifyTempToken(tToken);
      if (payload?.sub) {
        user = await repository.findUserById(payload.sub);
      }
    } catch {
      // Ignore
    }
  }

  if (!user && challengeId) {
    const challenge = await repository.findChallenge(challengeId);
    if (challenge) {
      user = (await challenge.populate("userId")).userId;
    }
  }

  if (!user && email) {
    user = await repository.findUserByEmail(email);
  }

  if (!user) {
    throw new AppError(400, "INVALID_REQUEST", "Could not locate active verification session.");
  }

  // Generate new OTP
  const code = String(crypto.randomInt(100000, 1000000));
  const device = fingerprint(req);
  const challenge = await repository.createChallenge({
    userId: user.id || user._id,
    codeHash: await bcrypt.hash(code, 12),
    fingerprint: device,
    expiresAt: new Date(Date.now() + 600000), // 10 mins
  });

  const nextTempToken = tempToken(user, challenge.id);

  user.otp = await bcrypt.hash(code, 12);
  user.otpExpires = new Date(Date.now() + 600000);
  user.tempToken = nextTempToken;
  await repository.saveUser(user);

  const emailResult = await sendOtpEmail({
    to: user.email,
    code,
    role: user.role === "superadmin" ? "SuperAdmin" : "Editor",
  });

  if (!emailResult.success) {
    throw new AppError(
      503,
      "EMAIL_UNAVAILABLE",
      "Email delivery service unavailable. Please check Brevo credentials."
    );
  }

  return {
    success: true,
    require2FA: true,
    requiresOtp: true,
    email: user.email,
    tempToken: nextTempToken,
    challengeId: challenge.id,
    message: "A new 6-digit verification code has been sent to your email.",
  };
}

export async function refresh(refresh) {
  let payload;
  try {
    payload = verifyRefreshToken(refresh);
  } catch {
    throw new AppError(401, "INVALID_SESSION", "Your session has expired. Please sign in again.");
  }
  const session = await repository.findSession(payload.sid);
  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    session.refreshTokenHash !== digest(refresh)
  ) {
    throw new AppError(401, "INVALID_SESSION", "Your session has expired. Please sign in again.");
  }
  const user = (await session.populate("userId")).userId;
  session.refreshTokenHash = "rotating";
  await repository.saveSession(session);
  const nextRefresh = refreshToken(user, session.id);
  session.refreshTokenHash = digest(nextRefresh);
  await repository.saveSession(session);
  const access = accessToken(user, session.id);
  return {
    access,
    token: access,
    refresh: nextRefresh,
    user: publicUser(user),
  };
}

export async function logout(sessionId) {
  if (!sessionId) return;
  const session = await repository.findSession(sessionId);
  if (session && !session.revokedAt) {
    session.revokedAt = new Date();
    await repository.saveSession(session);
  }
}

export async function requestPasswordReset(email) {
  const user = await repository.findUserByEmail(email, true);
  if (!user) return;
  const token = randomToken();
  user.resetTokenHash = digest(token);
  user.resetTokenExpiresAt = new Date(Date.now() + 3600000);
  await repository.saveUser(user);
  await sendMail({
    to: user.email,
    subject: "Reset your WellSphere password",
    text: `Use this link to reset your password: ${`${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`}`,
  });
}

export async function resetPassword({ password, token }) {
  const user = await repository.findUserByResetToken(digest(token));
  if (!user) {
    throw new AppError(400, "INVALID_RESET_TOKEN", "This reset link is invalid or expired.");
  }
  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await repository.saveUser(user);
  await repository.revokeUserSessions(user.id);
}

export const newDeviceId = deviceId;
