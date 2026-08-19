import AppError from "../utils/AppError.js";
import * as repo from "../repositories/contentRepository.js";

// ---------- Topics ----------

export const listTopics = () => repo.findAllTopics();

export async function getTopicWithArticles(slug) {
  const topic = await repo.findTopicBySlug(slug);
  if (!topic) throw new AppError(404, "TOPIC_NOT_FOUND", "This topic does not exist.");
  const articles = await repo.findPublishedArticles({ topicId: topic._id });
  return { topic, articles };
}

// ---------- Articles ----------

export const listArticles = ({ limit, topicSlug } = {}) => {
  if (topicSlug) {
    return repo.findTopicBySlug(topicSlug).then((topic) => {
      if (!topic) return [];
      return repo.findPublishedArticles({ limit, topicId: topic._id });
    });
  }
  return repo.findPublishedArticles({ limit });
};

export async function getArticle(slug) {
  const article = await repo.findArticleBySlug(slug);
  if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "This article does not exist or is no longer available.");
  const related = await repo.findRelatedArticles(article.topic._id, slug);
  return { article, related };
}

// ---------- Search ----------

export async function searchContent(query) {
  if (!query || query.trim().length < 2)
    throw new AppError(400, "QUERY_TOO_SHORT", "Search query must be at least 2 characters.");
  return repo.searchArticles(query.trim());
}
