import AppError from "../utils/AppError.js";
import * as repo from "../repositories/editorRepository.js";
import * as cloudinaryService from "./cloudinaryService.js";
import Topic from "../models/Topic.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(data) {
  let wordCount = 0;
  if (data.title) wordCount += data.title.split(/\s+/).length;
  if (data.excerpt) wordCount += data.excerpt.split(/\s+/).length;
  if (Array.isArray(data.sections)) {
    data.sections.forEach((s) => {
      if (s.heading) wordCount += s.heading.split(/\s+/).length;
      if (s.body) wordCount += s.body.split(/\s+/).length;
    });
  }
  if (data.homeCare) wordCount += data.homeCare.split(/\s+/).length;
  if (data.lifestyle) wordCount += data.lifestyle.split(/\s+/).length;
  if (data.exercise) wordCount += data.exercise.split(/\s+/).length;
  if (data.seekCare) wordCount += data.seekCare.split(/\s+/).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

// ---------- Articles Management ----------

export async function listMyArticles(authorId, query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const status = query.status || "all";
  const search = query.search || "";

  const [articles, total] = await Promise.all([
    repo.findArticlesByAuthor(authorId, { status, search, limit, skip }),
    repo.countArticlesByAuthor(authorId, { status, search }),
  ]);

  return {
    articles,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  };
}

export async function getArticle(articleId, user) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }
  const isAuthor = article.author?._id?.toString() === user.id || article.author?.toString() === user.id;
  if (!isAuthor && user.role !== "superadmin") {
    throw new AppError(403, "FORBIDDEN", "You do not have access to this article.");
  }
  return article;
}

export async function createArticle(authorId, payload) {
  const title = (payload.title || "").trim();
  if (!title) {
    throw new AppError(400, "VALIDATION_ERROR", "Article title is required.");
  }

  // Validate topic
  if (!payload.topic) {
    throw new AppError(400, "VALIDATION_ERROR", "A health topic is required.");
  }
  const topicDoc = await Topic.findById(payload.topic);
  if (!topicDoc) {
    throw new AppError(400, "INVALID_TOPIC", "Selected health topic is invalid.");
  }

  // Generate unique slug
  let slug = slugify(payload.slug || title);
  if (!slug) slug = "article-" + Date.now();

  const existingSlug = await repo.findArticleBySlug(slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const readingTime = payload.readingTime || calculateReadingTime(payload);
  const accent = ["sleep", "movement", "hydration", "headache"].includes(payload.accent)
    ? payload.accent
    : "movement";

  const article = await repo.createArticle({
    title,
    slug,
    excerpt: (payload.excerpt || "").trim(),
    topic: topicDoc._id,
    accent,
    author: authorId,
    readingTime,
    featuredImage: payload.featuredImage ? {
      url: payload.featuredImage.url,
      secureUrl: payload.featuredImage.secureUrl || payload.featuredImage.url,
      publicId: payload.featuredImage.publicId,
      alt: (payload.featuredImage.alt || "").trim(),
      caption: (payload.featuredImage.caption || "").trim(),
    } : undefined,
    sections: Array.isArray(payload.sections) ? payload.sections : [],
    homeCare: (payload.homeCare || "").trim(),
    lifestyle: (payload.lifestyle || "").trim(),
    exercise: (payload.exercise || "").trim(),
    seekCare: (payload.seekCare || "").trim(),
    sources: Array.isArray(payload.sources) ? payload.sources.filter(Boolean) : [],
    status: "draft",
  });

  return article.populate("topic", "slug name");
}

export async function updateArticle(articleId, user, payload) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const isAuthor = article.author?._id?.toString() === user.id || article.author?.toString() === user.id;
  if (!isAuthor && user.role !== "superadmin") {
    throw new AppError(403, "FORBIDDEN", "You cannot edit articles created by another author.");
  }

  if (payload.title !== undefined) article.title = payload.title.trim();
  if (payload.excerpt !== undefined) article.excerpt = payload.excerpt.trim();

  if (payload.slug !== undefined) {
    const newSlug = slugify(payload.slug);
    if (newSlug && newSlug !== article.slug) {
      const existing = await repo.findArticleBySlug(newSlug);
      if (existing && existing._id.toString() !== article._id.toString()) {
        throw new AppError(409, "SLUG_EXISTS", "An article with this slug already exists.");
      }
      article.slug = newSlug;
    }
  }

  if (payload.topic !== undefined) {
    const topicDoc = await Topic.findById(payload.topic);
    if (!topicDoc) {
      throw new AppError(400, "INVALID_TOPIC", "Selected topic does not exist.");
    }
    article.topic = topicDoc._id;
  }

  if (payload.accent !== undefined && ["sleep", "movement", "hydration", "headache"].includes(payload.accent)) {
    article.accent = payload.accent;
  }

  if (payload.featuredImage !== undefined) {
    article.featuredImage = payload.featuredImage ? {
      url: payload.featuredImage.url,
      secureUrl: payload.featuredImage.secureUrl || payload.featuredImage.url,
      publicId: payload.featuredImage.publicId,
      alt: (payload.featuredImage.alt || "").trim(),
      caption: (payload.featuredImage.caption || "").trim(),
    } : undefined;
  }

  if (payload.sections !== undefined && Array.isArray(payload.sections)) {
    article.sections = payload.sections.filter((s) => s.heading && s.body);
  }

  if (payload.homeCare !== undefined) article.homeCare = payload.homeCare.trim();
  if (payload.lifestyle !== undefined) article.lifestyle = payload.lifestyle.trim();
  if (payload.exercise !== undefined) article.exercise = payload.exercise.trim();
  if (payload.seekCare !== undefined) article.seekCare = payload.seekCare.trim();
  if (payload.sources !== undefined && Array.isArray(payload.sources)) {
    article.sources = payload.sources.filter(Boolean);
  }

  // Recalculate reading time
  article.readingTime = payload.readingTime || calculateReadingTime(article);

  // If changes were requested, editing can reset or keep notes
  if (article.status === "changes-requested" && payload.status === "draft") {
    article.status = "draft";
  }

  await repo.saveArticle(article);
  return article.populate("topic", "slug name");
}

export async function deleteArticle(articleId, user) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const isAuthor = article.author?._id?.toString() === user.id || article.author?.toString() === user.id;
  if (!isAuthor && user.role !== "superadmin") {
    throw new AppError(403, "FORBIDDEN", "You cannot delete an article you do not own.");
  }

  await repo.deleteArticleById(articleId);
  return { deleted: true, id: articleId };
}

export async function submitForReview(articleId, user) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const isAuthor = article.author?._id?.toString() === user.id || article.author?.toString() === user.id;
  if (!isAuthor && user.role !== "superadmin") {
    throw new AppError(403, "FORBIDDEN", "Only the author can submit this article for review.");
  }

  // Verification checks for editorial quality before submission
  if (!article.title || !article.excerpt || !article.topic) {
    throw new AppError(400, "INCOMPLETE_ARTICLE", "Please provide a title, excerpt, and topic before submitting.");
  }
  if (!article.sections || article.sections.length === 0) {
    throw new AppError(400, "INCOMPLETE_ARTICLE", "At least one article section is required before submitting.");
  }

  article.status = "pending-review";
  await repo.saveArticle(article);
  return article.populate("topic", "slug name");
}

export async function getEditorAnalytics(authorId) {
  const stats = await repo.getEditorStats(authorId);
  return stats;
}

// ---------- Comment Moderation ----------

export async function getCommentsQueue(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const status = query.status || "all";
  const search = query.search || "";

  const [comments, total] = await Promise.all([
    repo.findCommentsForModeration({ status, search, limit, skip }),
    repo.countCommentsForModeration({ status, search }),
  ]);

  return {
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  };
}

export async function moderateComment(commentId, { status, action }) {
  const comment = await repo.findCommentById(commentId);
  if (!comment) {
    throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found.");
  }

  if (action === "delete") {
    await repo.deleteCommentById(commentId);
    return { deleted: true, id: commentId };
  }

  if (status && ["approved", "flagged", "rejected"].includes(status)) {
    comment.status = status;
    await repo.saveComment(comment);
    return comment;
  }

  throw new AppError(400, "INVALID_ACTION", "Provide a valid status or action for moderation.");
}

// ---------- Media Handling (Cloudinary) ----------

export async function uploadArticleImage(fileData, { alt, caption } = {}) {
  const result = await cloudinaryService.uploadImage(fileData);
  return {
    url: result.url,
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    width: result.width,
    height: result.height,
    format: result.format,
    alt: alt || "",
    caption: caption || "",
  };
}

export async function deleteArticleImage(publicId) {
  await cloudinaryService.deleteImage(publicId);
  return { deleted: true, publicId };
}
