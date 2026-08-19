import { Router } from "express";
import * as controller from "../controllers/profileController.js";
import authenticate from "../middlewares/authenticate.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Profile
router.get("/profile", asyncHandler(controller.getProfile));
router.patch("/profile", asyncHandler(controller.updateProfile));

// Saved articles
router.get("/profile/saved", asyncHandler(controller.getSavedArticles));
router.post("/articles/:slug/save", asyncHandler(controller.saveArticle));
router.delete("/articles/:slug/save", asyncHandler(controller.unsaveArticle));

// Followed topics
router.get("/profile/following", asyncHandler(controller.getFollowedTopics));
router.post("/topics/:slug/follow", asyncHandler(controller.followTopic));
router.delete("/topics/:slug/follow", asyncHandler(controller.unfollowTopic));

// Notifications
router.get("/profile/notifications", asyncHandler(controller.getNotifications));
router.patch("/profile/notifications/read", asyncHandler(controller.markNotificationsRead));

// Comments history
router.get("/profile/comments", asyncHandler(controller.getUserComments));

export default router;
