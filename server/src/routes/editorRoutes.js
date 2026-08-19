import { Router } from "express";
import * as controller from "../controllers/editorController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";
import { mutationLimiter } from "../middlewares/rateLimiters.js";
import { recordAudit } from "../middlewares/auditLogger.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// All editor routes require authentication and editor or superadmin role
router.use(authenticate, authorize("editor", "superadmin"));

// Analytics
router.get("/analytics", asyncHandler(controller.getAnalytics));

// Articles
router.get("/articles", asyncHandler(controller.listArticles));
router.get("/articles/:id", asyncHandler(controller.getArticle));
router.post("/articles", mutationLimiter, recordAudit("ARTICLE_CREATE", "Article"), asyncHandler(controller.createArticle));
router.patch("/articles/:id", mutationLimiter, recordAudit("ARTICLE_UPDATE", "Article"), asyncHandler(controller.updateArticle));
router.delete("/articles/:id", mutationLimiter, recordAudit("ARTICLE_DELETE", "Article"), asyncHandler(controller.deleteArticle));
router.post("/articles/:id/submit", mutationLimiter, recordAudit("ARTICLE_SUBMIT_REVIEW", "Article"), asyncHandler(controller.submitForReview));

// Media Uploads (Cloudinary object storage)
router.post("/media/upload", mutationLimiter, recordAudit("MEDIA_UPLOAD", "Media"), asyncHandler(controller.uploadMedia));
router.delete("/media/:publicId", mutationLimiter, recordAudit("MEDIA_DELETE", "Media"), asyncHandler(controller.deleteMedia));

// Comment Moderation
router.get("/comments", asyncHandler(controller.listComments));
router.patch("/comments/:id", mutationLimiter, recordAudit("COMMENT_MODERATE", "Comment"), asyncHandler(controller.moderateComment));
router.delete("/comments/:id", mutationLimiter, (req, res, next) => {
  req.body = { ...req.body, action: "delete" };
  return asyncHandler(controller.moderateComment)(req, res, next);
});

export default router;
