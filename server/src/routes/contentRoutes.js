import { Router } from "express";
import * as controller from "../controllers/contentController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Topics
router.get("/topics", asyncHandler(controller.listTopics));
router.get("/topics/:slug", asyncHandler(controller.getTopicBySlug));

// Articles
router.get("/articles", asyncHandler(controller.listArticles));
router.get("/articles/:slug", asyncHandler(controller.getArticleBySlug));

// Search
router.get("/search", asyncHandler(controller.searchArticles));

export default router;
