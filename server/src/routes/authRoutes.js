import { Router } from "express";
import * as controller from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";
import {
  authLimiter,
  otpLimiter,
  resendOtpLimiter,
  passwordResetLimiter,
} from "../middlewares/rateLimiters.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/signup", authLimiter, asyncHandler(controller.signup));
router.post("/login", authLimiter, asyncHandler(controller.login));

// 2FA Verification (dedicated tight OTP limiter: 5 attempts / 10 min)
router.post("/verify-2fa", otpLimiter, asyncHandler(controller.verify2fa));
router.post("/verify-otp", otpLimiter, asyncHandler(controller.verify2fa));

// Resend OTP (max 3 resends / 10 min)
router.post("/resend-2fa", resendOtpLimiter, asyncHandler(controller.resend2fa));
router.post("/resend-otp", resendOtpLimiter, asyncHandler(controller.resend2fa));

router.post("/refresh", asyncHandler(controller.refresh));
router.post("/logout", authenticate, asyncHandler(controller.logout));
router.post("/forgot-password", passwordResetLimiter, asyncHandler(controller.forgotPassword));
router.post("/reset-password", passwordResetLimiter, asyncHandler(controller.resetPassword));

export default router;
