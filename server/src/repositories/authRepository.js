import OtpChallenge from "../models/OtpChallenge.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

export const findUserByEmail = (email, includeSecret = false) =>
  User.findOne({ email }).select(
    includeSecret ? "+passwordHash +resetTokenHash +otp +tempToken" : ""
  );

export const findUserById = (id) => User.findById(id).select("+otp +tempToken");

export const findUserByResetToken = (resetTokenHash) =>
  User.findOne({
    resetTokenHash,
    resetTokenExpiresAt: { $gt: new Date() },
  }).select("+passwordHash +resetTokenHash");

export const createUser = (data) => User.create(data);
export const saveUser = (user) => user.save();
export const createSession = (data) => Session.create(data);
export const findSession = (id) => Session.findById(id).select("+refreshTokenHash");
export const saveSession = (session) => session.save();
export const revokeUserSessions = (userId) =>
  Session.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() });

export const createChallenge = (data) => OtpChallenge.create(data);
export const findChallenge = (id) =>
  OtpChallenge.findOne({ _id: id, consumedAt: null, expiresAt: { $gt: new Date() } }).select("+codeHash");
export const findChallengeByUserId = (userId) =>
  OtpChallenge.findOne({ userId, consumedAt: null, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .select("+codeHash");
export const saveChallenge = (challenge) => challenge.save();
