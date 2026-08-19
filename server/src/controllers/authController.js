import env from "../config/env.js";
import * as auth from "../services/authService.js";
import * as validate from "../validators/authValidator.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  path: "/",
};
const deviceOptions = { ...cookieOptions, maxAge: 31536000000 };
const sessionOptions = { ...cookieOptions, maxAge: 604800000 }; // 7 days

function ensureDevice(req, res) {
  if (!req.cookies?.device_id) {
    const id = auth.newDeviceId();
    req.cookies = { ...req.cookies, device_id: id };
    res.cookie("device_id", id, deviceOptions);
  }
}

function writeSession(res, session) {
  const isPrivileged = ["superadmin", "editor"].includes(session.user?.role);
  const accessMaxAge = isPrivileged ? 1800000 : 900000; // 30m for privileged, 15m for user

  res.cookie("access_token", session.access || session.token, {
    ...cookieOptions,
    maxAge: accessMaxAge,
  });
  res.cookie("refresh_token", session.refresh, sessionOptions);
}

function clearSession(res) {
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
}

export async function signup(req, res) {
  ensureDevice(req, res);
  const session = await auth.signup(validate.signupInput(req.body), req);
  writeSession(res, session);
  res.status(201).json({
    success: true,
    data: { user: session.user, token: session.access },
    user: session.user,
    token: session.access,
  });
}

export async function login(req, res) {
  ensureDevice(req, res);
  const result = await auth.login(validate.loginInput(req.body), req);

  if (result.require2FA || result.requiresOtp) {
    return res.status(200).json({
      success: true,
      require2FA: true,
      requiresOtp: true,
      email: result.email,
      tempToken: result.tempToken,
      challengeId: result.challengeId,
      message: result.message,
      data: result,
    });
  }

  writeSession(res, result);
  res.status(200).json({
    success: true,
    data: { user: result.user, token: result.access },
    user: result.user,
    token: result.access,
  });
}

export async function verify2fa(req, res) {
  ensureDevice(req, res);
  const session = await auth.verifyOtp(validate.otpInput(req.body), req);

  if (session.newDeviceId) {
    res.cookie("trusted_device_id", session.newDeviceId, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 Days
    });
    res.cookie("device_id", session.newDeviceId, deviceOptions);
  }

  writeSession(res, session);
  res.status(200).json({
    success: true,
    data: { user: session.user, token: session.access },
    user: session.user,
    token: session.access,
  });
}

export async function resend2fa(req, res) {
  ensureDevice(req, res);
  const result = await auth.resendOtp(validate.resendOtpInput(req.body), req);
  res.status(200).json({
    success: true,
    require2FA: true,
    requiresOtp: true,
    email: result.email,
    tempToken: result.tempToken,
    challengeId: result.challengeId,
    message: result.message,
    data: result,
  });
}

export async function refresh(req, res) {
  const session = await auth.refresh(req.cookies?.refresh_token);
  writeSession(res, session);
  res.status(200).json({
    success: true,
    data: { user: session.user, token: session.access },
    user: session.user,
    token: session.access,
  });
}

export async function logout(req, res) {
  await auth.logout(req.auth?.sid);
  clearSession(res);
  res.status(200).json({ success: true, data: null });
}

export async function forgotPassword(req, res) {
  await auth.requestPasswordReset(validate.resetRequestInput(req.body));
  res.status(200).json({
    success: true,
    data: null,
    message: "If an account exists, a reset link has been sent.",
  });
}

export async function resetPassword(req, res) {
  await auth.resetPassword(validate.resetInput(req.body));
  clearSession(res);
  res.status(200).json({
    success: true,
    data: null,
    message: "Your password has been reset. Please sign in.",
  });
}
