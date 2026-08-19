import AppError from "../utils/AppError.js";
import * as repo from "../repositories/profileRepository.js";

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

// ---------- Profile ----------

export async function getProfile(userId) {
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  return publicUser(user);
}

export async function updateProfile(userId, { name }) {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (!trimmed || trimmed.length > 80)
    throw new AppError(400, "VALIDATION_ERROR", "Name must be between 1 and 80 characters.");
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  user.name = trimmed;
  await repo.saveUser(user);
  return publicUser(user);
}

// ---------- Saved articles ----------

export async function getSavedArticles(userId) {
  const result = await repo.findSavedArticles(userId);
  return result?.savedArticles ?? [];
}

export async function saveArticle(userId, slug) {
  const article = await repo.findArticleBySlug(slug);
  if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  if (!user.savedArticles.some((id) => id.equals(article._id))) {
    user.savedArticles.push(article._id);
    await repo.saveUser(user);
  }
  return { saved: true, slug };
}

export async function unsaveArticle(userId, slug) {
  const article = await repo.findArticleBySlug(slug);
  if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found.");
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  user.savedArticles = user.savedArticles.filter((id) => !id.equals(article._id));
  await repo.saveUser(user);
  return { saved: false, slug };
}

// ---------- Followed topics ----------

export async function getFollowedTopics(userId) {
  const result = await repo.findFollowedTopics(userId);
  return result?.followedTopics ?? [];
}

export async function followTopic(userId, slug) {
  const topic = await repo.findTopicBySlug(slug);
  if (!topic) throw new AppError(404, "TOPIC_NOT_FOUND", "Topic not found.");
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  if (!user.followedTopics.some((id) => id.equals(topic._id))) {
    user.followedTopics.push(topic._id);
    await repo.saveUser(user);
  }
  return { following: true, slug };
}

export async function unfollowTopic(userId, slug) {
  const topic = await repo.findTopicBySlug(slug);
  if (!topic) throw new AppError(404, "TOPIC_NOT_FOUND", "Topic not found.");
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  user.followedTopics = user.followedTopics.filter((id) => !id.equals(topic._id));
  await repo.saveUser(user);
  return { following: false, slug };
}

// ---------- Notifications ----------

export async function getNotifications(userId) {
  const result = await repo.findUserWithNotifications(userId);
  const notifications = result?.notifications ?? [];
  // Return newest first, unread first within same createdAt
  return [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export async function markNotificationsRead(userId) {
  const user = await repo.findUserById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  user.notifications.forEach((n) => { n.read = true; });
  await repo.saveUser(user);
  return { success: true };
}

// ---------- Comments ----------

export const getUserComments = (userId) => repo.findUserComments(userId);
