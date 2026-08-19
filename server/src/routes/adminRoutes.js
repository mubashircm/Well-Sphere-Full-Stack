import { Router } from "express";
import * as controller from "../controllers/adminController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// All admin routes require SuperAdmin role
router.use(authenticate, authorize("superadmin"));

// Dashboard Overview
router.get("/dashboard", asyncHandler(controller.getDashboard));

// Review Queue & Approval Workflow
router.get("/review-queue", asyncHandler(controller.getReviewQueue));
router.get("/articles/:id", asyncHandler(controller.getArticleDetails));
router.post("/articles/:id/approve", asyncHandler(controller.approveArticle));
router.post("/articles/:id/reject", asyncHandler(controller.rejectArticle));
router.post("/articles/:id/request-changes", asyncHandler(controller.requestChanges));

// User Management
router.get("/users", asyncHandler(controller.listUsers));
router.patch("/users/:id", asyncHandler(controller.updateUserRole));

// Security & Moderation Audit Logs
router.get("/audit-logs", asyncHandler(controller.listAuditLogs));

// Global Settings & Emergency Maintenance
router.get("/settings", asyncHandler(controller.getSettings));
router.patch("/settings", asyncHandler(controller.updateSettings));

export default router;
