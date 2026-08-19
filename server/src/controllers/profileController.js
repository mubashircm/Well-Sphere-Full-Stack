import * as profile from "../services/profileService.js";

// ---------- Profile ----------

export async function getProfile(req, res) {
  const data = await profile.getProfile(req.auth.sub);
  res.status(200).json({ success: true, data });
}

export async function updateProfile(req, res) {
  const data = await profile.updateProfile(req.auth.sub, req.body);
  res.status(200).json({ success: true, data, message: "Profile updated." });
}

// ---------- Saved articles ----------

export async function getSavedArticles(req, res) {
  const data = await profile.getSavedArticles(req.auth.sub);
  res.status(200).json({ success: true, data });
}

export async function saveArticle(req, res) {
  const data = await profile.saveArticle(req.auth.sub, req.params.slug);
  res.status(200).json({ success: true, data });
}

export async function unsaveArticle(req, res) {
  const data = await profile.unsaveArticle(req.auth.sub, req.params.slug);
  res.status(200).json({ success: true, data });
}

// ---------- Followed topics ----------

export async function getFollowedTopics(req, res) {
  const data = await profile.getFollowedTopics(req.auth.sub);
  res.status(200).json({ success: true, data });
}

export async function followTopic(req, res) {
  const data = await profile.followTopic(req.auth.sub, req.params.slug);
  res.status(200).json({ success: true, data });
}

export async function unfollowTopic(req, res) {
  const data = await profile.unfollowTopic(req.auth.sub, req.params.slug);
  res.status(200).json({ success: true, data });
}

// ---------- Notifications ----------

export async function getNotifications(req, res) {
  const data = await profile.getNotifications(req.auth.sub);
  res.status(200).json({ success: true, data });
}

export async function markNotificationsRead(req, res) {
  const data = await profile.markNotificationsRead(req.auth.sub);
  res.status(200).json({ success: true, data });
}

// ---------- Comments ----------

export async function getUserComments(req, res) {
  const data = await profile.getUserComments(req.auth.sub);
  res.status(200).json({ success: true, data });
}
