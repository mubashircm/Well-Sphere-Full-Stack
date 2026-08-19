import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const randomToken = () => crypto.randomBytes(32).toString("base64url");

export const accessToken = (user, sessionId) => {
  const isPrivileged = ["superadmin", "editor"].includes(user.role);
  const expiresIn = isPrivileged ? "30m" : "15m";
  return jwt.sign(
    { sub: user.id || user._id, role: user.role, sid: sessionId, type: "access" },
    env.jwtAccessSecret,
    { expiresIn }
  );
};

export const refreshToken = (user, sessionId) =>
  jwt.sign(
    { sub: user.id || user._id, sid: sessionId, type: "refresh" },
    env.jwtRefreshSecret,
    { expiresIn: "7d" }
  );

export const tempToken = (user, challengeId) =>
  jwt.sign(
    { sub: user.id || user._id, email: user.email, role: user.role, cid: challengeId, type: "2fa_temp" },
    env.jwtAccessSecret,
    { expiresIn: "10m" }
  );

export const verifyTempToken = (token) => jwt.verify(token, env.jwtAccessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);
