import AppError from "../utils/AppError.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const disposableDomains = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
]);

const text = (value) => (typeof value === "string" ? value.trim() : "");
const password = (value) =>
  typeof value === "string" &&
  value.length >= 12 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value);

const invalid = (message) => {
  throw new AppError(400, "VALIDATION_ERROR", message);
};

export const signupInput = (body = {}) => {
  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const termsAccepted = body.termsAccepted === true;
  if (
    !name ||
    name.length > 80 ||
    !emailPattern.test(email) ||
    disposableDomains.has(email.split("@")[1]) ||
    !password(body.password) ||
    body.password !== body.confirmPassword ||
    !termsAccepted
  ) {
    invalid(
      "Provide a name, non-disposable email, accepted terms, and a matching 12-character password with upper, lower, and numeric characters."
    );
  }
  return { name, email, password: body.password };
};

export const loginInput = (body = {}) => {
  const email = text(body.email).toLowerCase();
  if (!emailPattern.test(email) || typeof body.password !== "string") {
    invalid("Provide a valid email address and password.");
  }
  return { email, password: body.password };
};

export const otpInput = (body = {}) => {
  const code = text(body.code || body.otp);
  const challengeId = text(body.challengeId);
  const tempToken = text(body.tempToken);
  const email = text(body.email).toLowerCase();

  if (!/^\d{6}$/.test(code)) {
    invalid("Provide a valid six-digit verification code.");
  }

  if (!challengeId && !tempToken && !email) {
    invalid("Missing verification session identifier.");
  }

  return { challengeId, tempToken, code, otp: code, email };
};

export const resendOtpInput = (body = {}) => {
  const challengeId = text(body.challengeId);
  const tempToken = text(body.tempToken);
  const email = text(body.email).toLowerCase();

  if (!challengeId && !tempToken && !email) {
    invalid("Missing verification session identifier or email.");
  }

  return { challengeId, tempToken, email };
};

export const resetRequestInput = (body = {}) => {
  const email = text(body.email).toLowerCase();
  if (!emailPattern.test(email)) invalid("Provide a valid email address.");
  return email;
};

export const resetInput = (body = {}) => {
  if (!text(body.token) || !password(body.password) || body.password !== body.confirmPassword) {
    invalid(
      "Provide a valid reset token and matching 12-character password with upper, lower, and numeric characters."
    );
  }
  return { token: text(body.token), password: body.password };
};
