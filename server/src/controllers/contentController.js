import * as content from "../services/contentService.js";

export async function listTopics(req, res) {
  const topics = await content.listTopics();
  res.status(200).json({ success: true, data: topics });
}

export async function getTopicBySlug(req, res) {
  const result = await content.getTopicWithArticles(req.params.slug);
  res.status(200).json({ success: true, data: result });
}

export async function listArticles(req, res) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const topicSlug = req.query.topic || null;
  const articles = await content.listArticles({ limit, topicSlug });
  res.status(200).json({ success: true, data: articles });
}

export async function getArticleBySlug(req, res) {
  const result = await content.getArticle(req.params.slug);
  res.status(200).json({ success: true, data: result });
}

export async function searchArticles(req, res) {
  const results = await content.searchContent(req.query.q);
  res.status(200).json({ success: true, data: results });
}
