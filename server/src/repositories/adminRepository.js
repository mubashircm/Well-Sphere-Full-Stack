import Article from "../models/Article.js";
import AuditLog from "../models/AuditLog.js";
import Comment from "../models/Comment.js";
import SystemSetting from "../models/SystemSetting.js";
import User from "../models/User.js";

// ---------- Dashboard Stats ----------

export const getSystemOverviewStats = async () => {
  const [usersCount, usersByRole, articlesByStatus, totalComments, flaggedComments, totalLogs] =
    await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Article.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Comment.countDocuments(),
      Comment.countDocuments({ status: "flagged" }),
      AuditLog.countDocuments(),
    ]);

  const roles = { user: 0, editor: 0, superadmin: 0 };
  usersByRole.forEach((r) => {
    if (r._id in roles) roles[r._id] = r.count;
  });

  const articleStatuses = {
    draft: 0,
    "pending-review": 0,
    published: 0,
    "changes-requested": 0,
    total: 0,
  };
  articlesByStatus.forEach((s) => {
    if (s._id in articleStatuses) articleStatuses[s._id] = s.count;
    articleStatuses.total += s.count;
  });

  return {
    users: { total: usersCount, ...roles },
    articles: articleStatuses,
    comments: { total: totalComments, flagged: flaggedComments },
    auditLogs: { total: totalLogs },
  };
};

// ---------- Review Queue ----------

export const findReviewQueue = ({ topicId, search, limit = 50, skip = 0 } = {}) => {
  const query = { status: "pending-review" };
  if (topicId) query.topic = topicId;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { slug: regex }];
  }

  return Article.find(query)
    .sort({ updatedAt: 1 }) // oldest pending first for fair review queue
    .skip(skip)
    .limit(limit)
    .populate("topic", "slug name")
    .populate("author", "name email role")
    .lean();
};

export const countReviewQueue = ({ topicId, search } = {}) => {
  const query = { status: "pending-review" };
  if (topicId) query.topic = topicId;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { slug: regex }];
  }
  return Article.countDocuments(query);
};

export const findArticleById = (id) =>
  Article.findById(id)
    .populate("topic", "slug name")
    .populate("author", "name email role");

export const saveArticle = (article) => article.save();

// ---------- Users Management ----------

export const findUsers = ({ role, search, limit = 50, skip = 0 } = {}) => {
  const query = {};
  if (role && role !== "all") query.role = role;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: regex }, { email: regex }];
  }

  return User.find(query)
    .select("-passwordHash -resetTokenHash")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countUsers = ({ role, search } = {}) => {
  const query = {};
  if (role && role !== "all") query.role = role;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: regex }, { email: regex }];
  }
  return User.countDocuments(query);
};

export const findUserById = (id) => User.findById(id).select("-passwordHash -resetTokenHash");

export const saveUser = (user) => user.save();

// ---------- Audit Logs ----------

export const createAuditLog = (data) => AuditLog.create(data);

export const findAuditLogs = ({ action, targetType, limit = 50, skip = 0 } = {}) => {
  const query = {};
  if (action && action !== "all") query.action = action;
  if (targetType && targetType !== "all") query.targetType = targetType;

  return AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("actor", "name email role")
    .lean();
};

export const countAuditLogs = ({ action, targetType } = {}) => {
  const query = {};
  if (action && action !== "all") query.action = action;
  if (targetType && targetType !== "all") query.targetType = targetType;
  return AuditLog.countDocuments(query);
};

// ---------- System Settings ----------

export const findAllSettings = () => SystemSetting.find({}).populate("updatedBy", "name email").lean();

export const findSettingByKey = (key) => SystemSetting.findOne({ key });

export const upsertSetting = (key, value, description, updatedBy) =>
  SystemSetting.findOneAndUpdate(
    { key },
    { value, description, updatedBy },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
