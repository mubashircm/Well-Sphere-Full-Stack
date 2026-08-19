import AppError from "../utils/AppError.js";
import * as repo from "../repositories/adminRepository.js";

// ---------- Dashboard Stats ----------

export async function getDashboardOverview() {
  const stats = await repo.getSystemOverviewStats();
  return stats;
}

// ---------- Review Queue & Article Approval ----------

export async function getReviewQueue(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const search = query.search || "";
  const topicId = query.topicId || undefined;

  const [articles, total] = await Promise.all([
    repo.findReviewQueue({ topicId, search, limit, skip }),
    repo.countReviewQueue({ topicId, search }),
  ]);

  return {
    articles,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  };
}

export async function getArticleDetails(articleId) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }
  return article;
}

export async function approveArticle(articleId, adminUser, reqContext = {}) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const previousStatus = article.status;
  article.status = "published";
  article.reviewNotes = "";
  await repo.saveArticle(article);

  // Audit Log
  await repo.createAuditLog({
    action: "ARTICLE_APPROVED",
    actor: adminUser.id,
    targetType: "Article",
    targetId: article._id.toString(),
    details: {
      title: article.title,
      slug: article.slug,
      author: article.author?._id?.toString() || article.author?.toString(),
      previousStatus,
    },
    ip: reqContext.ip,
    userAgent: reqContext.userAgent,
  });

  return article;
}

export async function rejectArticle(articleId, adminUser, { reason } = {}, reqContext = {}) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const previousStatus = article.status;
  article.status = "draft";
  article.reviewNotes = (reason || "Submission rejected by administrator.").trim();
  await repo.saveArticle(article);

  // Audit Log
  await repo.createAuditLog({
    action: "ARTICLE_REJECTED",
    actor: adminUser.id,
    targetType: "Article",
    targetId: article._id.toString(),
    details: {
      title: article.title,
      slug: article.slug,
      reason: article.reviewNotes,
      previousStatus,
    },
    ip: reqContext.ip,
    userAgent: reqContext.userAgent,
  });

  return article;
}

export async function requestChanges(articleId, adminUser, { notes } = {}, reqContext = {}) {
  const article = await repo.findArticleById(articleId);
  if (!article) {
    throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  }

  const feedback = (notes || "").trim();
  if (!feedback) {
    throw new AppError(400, "VALIDATION_ERROR", "Reviewer notes are required when requesting changes.");
  }

  const previousStatus = article.status;
  article.status = "changes-requested";
  article.reviewNotes = feedback;
  await repo.saveArticle(article);

  // Audit Log
  await repo.createAuditLog({
    action: "CHANGES_REQUESTED",
    actor: adminUser.id,
    targetType: "Article",
    targetId: article._id.toString(),
    details: {
      title: article.title,
      slug: article.slug,
      notes: feedback,
      previousStatus,
    },
    ip: reqContext.ip,
    userAgent: reqContext.userAgent,
  });

  return article;
}

// ---------- Users Management ----------

export async function listUsers(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  const role = query.role || "all";
  const search = query.search || "";

  const [users, total] = await Promise.all([
    repo.findUsers({ role, search, limit, skip }),
    repo.countUsers({ role, search }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  };
}

export async function updateUserRole(userId, adminUser, { role }, reqContext = {}) {
  const allowedRoles = ["user", "editor", "superadmin"];
  if (!allowedRoles.includes(role)) {
    throw new AppError(400, "INVALID_ROLE", `Role must be one of: ${allowedRoles.join(", ")}`);
  }

  const targetUser = await repo.findUserById(userId);
  if (!targetUser) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  }

  // Prevent superadmin from accidentally removing their own superadmin role
  if (targetUser._id.toString() === adminUser.id && role !== "superadmin") {
    throw new AppError(400, "CANNOT_DEMOTE_SELF", "You cannot revoke your own SuperAdmin privileges.");
  }

  const previousRole = targetUser.role;
  targetUser.role = role;
  await repo.saveUser(targetUser);

  // Audit Log
  await repo.createAuditLog({
    action: "USER_ROLE_CHANGED",
    actor: adminUser.id,
    targetType: "User",
    targetId: targetUser._id.toString(),
    details: {
      targetEmail: targetUser.email,
      targetName: targetUser.name,
      previousRole,
      newRole: role,
    },
    ip: reqContext.ip,
    userAgent: reqContext.userAgent,
  });

  return targetUser;
}

// ---------- Audit Logs ----------

export async function listAuditLogs(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 30));
  const skip = (page - 1) * limit;
  const action = query.action || "all";
  const targetType = query.targetType || "all";

  const [logs, total] = await Promise.all([
    repo.findAuditLogs({ action, targetType, limit, skip }),
    repo.countAuditLogs({ action, targetType }),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    limit,
  };
}

// ---------- System Settings ----------

const DEFAULT_SETTINGS = {
  emergencyMaintenance: false,
  publicRegistration: true,
  autoApproveComments: true,
  siteName: "WellSphere",
  announcementBanner: "",
};

export async function getSystemSettings() {
  const settingsList = await repo.findAllSettings();
  const settingsMap = { ...DEFAULT_SETTINGS };

  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return settingsMap;
}

export async function updateSystemSettings(newSettings = {}, adminUser, reqContext = {}) {
  const updatedKeys = [];

  for (const [key, value] of Object.entries(newSettings)) {
    if (key in DEFAULT_SETTINGS) {
      await repo.upsertSetting(key, value, `Configuration for ${key}`, adminUser.id);
      updatedKeys.push({ key, value });
    }
  }

  // Audit Log
  await repo.createAuditLog({
    action: "SETTINGS_UPDATED",
    actor: adminUser.id,
    targetType: "System",
    targetId: "global-config",
    details: { updatedKeys },
    ip: reqContext.ip,
    userAgent: reqContext.userAgent,
  });

  return getSystemSettings();
}
