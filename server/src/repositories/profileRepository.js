import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

// ---------- Profile ----------

export const findUserById = (id) => User.findById(id);

export const saveUser = (user) => user.save();

// ---------- Saved articles ----------

export const findSavedArticles = (userId) =>
  User.findById(userId)
    .select("savedArticles")
    .populate({
      path: "savedArticles",
      match: { status: "published" },
      select: "slug title excerpt topic accent readingTime createdAt",
      populate: { path: "topic", select: "slug name" },
      options: { sort: { createdAt: -1 } },
    })
    .lean();

export const findArticleById = (id) => Article.findById(id).select("_id slug status").lean();

export const findArticleBySlug = (slug) =>
  Article.findOne({ slug, status: "published" }).select("_id slug").lean();

// ---------- Followed topics ----------

export const findFollowedTopics = (userId) =>
  User.findById(userId)
    .select("followedTopics")
    .populate({ path: "followedTopics", select: "slug name description" })
    .lean();

export const findTopicById = (id) =>
  import("../models/Topic.js").then((m) => m.default.findById(id).select("_id slug").lean());

export const findTopicBySlug = (slug) =>
  import("../models/Topic.js").then((m) => m.default.findOne({ slug }).select("_id slug").lean());

// ---------- Notifications ----------

export const findUserWithNotifications = (userId) =>
  User.findById(userId).select("notifications").lean();

// ---------- Comments ----------

export const findUserComments = (userId) =>
  Comment.find({ user: userId, status: { $ne: "rejected" } })
    .sort({ createdAt: -1 })
    .populate("article", "slug title")
    .select("text article likes status createdAt")
    .lean();
