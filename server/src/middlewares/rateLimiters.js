import rateLimit from "express-rate-limit";

const errorResponse = (code, message) => ({
  success: false,
  error: { code, message },
});

// Auth endpoints: login, signup (10 attempts / 15 min)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("TOO_MANY_REQUESTS", "Too many authentication attempts. Please try again in 15 minutes."),
});

// OTP verification: very tight to prevent brute-force on 6-digit codes
// 5 attempts / 10 min per IP (aligns with challenge.attempts model-level check)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("TOO_MANY_REQUESTS", "Too many verification attempts. Please wait before trying again."),
});

// OTP resend: max 3 resends / 10 min per IP
export const resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("TOO_MANY_REQUESTS", "Too many resend requests. Please wait before requesting another code."),
});

// Password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("TOO_MANY_REQUESTS", "Too many password reset requests. Please check your email or try again later."),
});

// Mutation operations (write endpoints)
export const mutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("RATE_LIMIT_EXCEEDED", "Too many operations in a short period. Please slow down."),
});

// General API request ceiling
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("RATE_LIMIT_EXCEEDED", "Request limit reached. Please try again shortly."),
});
