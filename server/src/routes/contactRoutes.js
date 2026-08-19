import { Router } from "express";
import * as contactController from "../controllers/contactController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { mutationLimiter } from "../middlewares/rateLimiters.js";
import { recordAudit } from "../middlewares/auditLogger.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Public contact form submission
router.post("/", mutationLimiter, asyncHandler(contactController.submitContact));

// Protected inquiry feed (Editor + SuperAdmin)
router.get(
  "/inquiries",
  authenticate,
  authorize("editor", "superadmin"),
  asyncHandler(contactController.getInquiries)
);

// Protected status update (Editor + SuperAdmin)
router.patch(
  "/inquiries/:id/status",
  authenticate,
  authorize("editor", "superadmin"),
  recordAudit("INQUIRY_STATUS_UPDATED", "Inquiry"),  // fixed: positional args, not object literal
  asyncHandler(contactController.updateStatus)
);

export default router;
