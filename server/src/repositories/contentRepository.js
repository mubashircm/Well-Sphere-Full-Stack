import Article from "../models/Article.js";
import Topic from "../models/Topic.js";

// ---------- Topic queries ----------

export const findAllTopics = () =>
  Topic.find({}).sort({ name: 1 }).lean();

export const findTopicBySlug = (slug) =>
  Topic.findOne({ slug }).lean();

// ---------- Article queries ----------

const PUBLIC_FIELDS =
  "slug title excerpt topic accent readingTime createdAt";

export const findPublishedArticles = ({ limit = 20, topicId } = {}) => {
  const filter = { status: "published" };
  if (topicId) filter.topic = topicId;
  return Article.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("topic", "slug name")
    .select(PUBLIC_FIELDS)
    .lean();
};

export const findArticleBySlug = (slug) =>
  Article.findOne({ slug, status: "published" })
    .populate("topic", "slug name")
    .lean();

export const findRelatedArticles = (topicId, excludeSlug, limit = 2) =>
  Article.find({ topic: topicId, status: "published", slug: { $ne: excludeSlug } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("topic", "slug name")
    .select(PUBLIC_FIELDS)
    .lean();

export const searchArticles = (query, limit = 20) => {
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return Article.find({
    status: "published",
    $or: [{ title: regex }, { excerpt: regex }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("topic", "slug name")
    .select(PUBLIC_FIELDS)
    .lean();
};
