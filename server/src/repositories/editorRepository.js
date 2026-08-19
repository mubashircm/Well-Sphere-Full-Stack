import Article from "../models/Article.js";
import Comment from "../models/Comment.js";

// ---------- Articles ----------

export const findArticlesByAuthor = (authorId, { status, search, limit = 50, skip = 0 } = {}) => {
  const query = { author: authorId };
  if (status && status !== "all") {
    query.status = status;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { slug: regex }];
  }
  return Article.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("topic", "slug name")
    .lean();
};

export const countArticlesByAuthor = (authorId, { status, search } = {}) => {
  const query = { author: authorId };
  if (status && status !== "all") {
    query.status = status;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { slug: regex }];
  }
  return Article.countDocuments(query);
};

export const findArticleById = (id) =>
  Article.findById(id).populate("topic", "slug name").populate("author", "name email");

export const findArticleBySlug = (slug) => Article.findOne({ slug });

export const createArticle = (data) => Article.create(data);

export const saveArticle = (article) => article.save();

export const deleteArticleById = (id) => Article.findByIdAndDelete(id);

export const getEditorStats = async (authorId) => {
  const stats = await Article.aggregate([
    { $match: { author: authorId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    total: 0,
    draft: 0,
    "pending-review": 0,
    published: 0,
    "changes-requested": 0,
  };

  stats.forEach((item) => {
    if (item._id in summary) {
      summary[item._id] = item.count;
    }
    summary.total += item.count;
  });

  return summary;
};

// ---------- Comment Moderation ----------

export const findCommentsForModeration = ({ status, search, limit = 50, skip = 0 } = {}) => {
  const query = {};
  if (status && status !== "all") {
    query.status = status;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.text = regex;
  }

  return Comment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name email")
    .populate("article", "slug title")
    .lean();
};

export const countCommentsForModeration = ({ status, search } = {}) => {
  const query = {};
  if (status && status !== "all") {
    query.status = status;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.text = regex;
  }
  return Comment.countDocuments(query);
};

export const findCommentById = (id) => Comment.findById(id);

export const saveComment = (comment) => comment.save();

export const deleteCommentById = (id) => Comment.findByIdAndDelete(id);
