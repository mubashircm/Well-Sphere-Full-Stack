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

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;

const password = (value) =>
  typeof value === "string" && PASSWORD_REGEX.test(value);

const invalid = (message) => {
  throw new AppError(400, "VALIDATION_ERROR", message);
};

export const signupInput = (body = {}) => {
  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const termsAccepted = body.termsAccepted === true;
  if (!name || name.length > 80) {
    invalid("Please provide a valid full name (maximum 80 characters).");
  }
  if (!emailPattern.test(email) || disposableDomains.has(email.split("@")[1])) {
    invalid("Please provide a valid, non-disposable email address.");
  }
  if (!password(body.password)) {
    invalid(
      "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }
  if (body.password !== body.confirmPassword) {
    invalid("Passwords do not match. Please verify your password confirmation.");
  }
  if (!termsAccepted) {
    invalid("You must accept the terms and conditions to create an account.");
  }
  return { name, email, password: body.password };
};

export const loginInput = (body = {}) => {
  const email = text(body.email).toLowerCase();
  if (!emailPattern.test(email) || typeof body.password !== "string" || !body.password) {
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
  const token = text(body.token);
  if (!token) {
    invalid("Missing or invalid reset token. Please request a new password reset link.");
  }
  if (!password(body.password)) {
    invalid(
      "Password must be 8-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }
  if (body.password !== body.confirmPassword) {
    invalid("Passwords do not match. Please verify your password confirmation.");
  }
  return { token, password: body.password };
};
