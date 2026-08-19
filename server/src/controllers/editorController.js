import * as editorService from "../services/editorService.js";

// ---------- Articles ----------

export async function listArticles(req, res) {
  const result = await editorService.listMyArticles(req.auth.sub, req.query);
  res.status(200).json({ success: true, data: result });
}

export async function getArticle(req, res) {
  const article = await editorService.getArticle(req.params.id, {
    id: req.auth.sub,
    role: req.auth.role,
  });
  res.status(200).json({ success: true, data: article });
}

export async function createArticle(req, res) {
  const article = await editorService.createArticle(req.auth.sub, req.body);
  res.status(201).json({
    success: true,
    data: article,
    message: "Article draft created successfully.",
  });
}

export async function updateArticle(req, res) {
  const article = await editorService.updateArticle(
    req.params.id,
    { id: req.auth.sub, role: req.auth.role },
    req.body
  );
  res.status(200).json({
    success: true,
    data: article,
    message: "Article updated successfully.",
  });
}

export async function deleteArticle(req, res) {
  const result = await editorService.deleteArticle(req.params.id, {
    id: req.auth.sub,
    role: req.auth.role,
  });
  res.status(200).json({
    success: true,
    data: result,
    message: "Article deleted successfully.",
  });
}

export async function submitForReview(req, res) {
  const article = await editorService.submitForReview(req.params.id, {
    id: req.auth.sub,
    role: req.auth.role,
  });
  res.status(200).json({
    success: true,
    data: article,
    message: "Article submitted for editorial review.",
  });
}

export async function getAnalytics(req, res) {
  const stats = await editorService.getEditorAnalytics(req.auth.sub);
  res.status(200).json({ success: true, data: stats });
}

// ---------- Comments Moderation ----------

export async function listComments(req, res) {
  const result = await editorService.getCommentsQueue(req.query);
  res.status(200).json({ success: true, data: result });
}

export async function moderateComment(req, res) {
  const result = await editorService.moderateComment(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: result,
    message: req.body.action === "delete" ? "Comment deleted." : "Comment status updated.",
  });
}

// ---------- Media Uploads (Cloudinary) ----------

export async function uploadMedia(req, res) {
  const { file, alt, caption } = req.body;
  const result = await editorService.uploadArticleImage(file, { alt, caption });
  res.status(201).json({
    success: true,
    data: result,
    message: "Image uploaded successfully to object storage.",
  });
}

export async function deleteMedia(req, res) {
  await editorService.deleteArticleImage(req.params.publicId);
  res.status(200).json({
    success: true,
    data: null,
    message: "Media asset deleted from storage.",
  });
}
