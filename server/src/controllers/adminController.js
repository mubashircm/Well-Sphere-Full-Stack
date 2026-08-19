import * as adminService from "../services/adminService.js";

const getReqContext = (req) => ({
  ip: req.ip || req.connection?.remoteAddress,
  userAgent: req.get("user-agent") || "unknown",
});

// ---------- Dashboard ----------

export async function getDashboard(req, res) {
  const data = await adminService.getDashboardOverview();
  res.status(200).json({ success: true, data });
}

// ---------- Review Queue ----------

export async function getReviewQueue(req, res) {
  const data = await adminService.getReviewQueue(req.query);
  res.status(200).json({ success: true, data });
}

export async function getArticleDetails(req, res) {
  const data = await adminService.getArticleDetails(req.params.id);
  res.status(200).json({ success: true, data });
}

export async function approveArticle(req, res) {
  const data = await adminService.approveArticle(
    req.params.id,
    { id: req.auth.sub, role: req.auth.role },
    getReqContext(req)
  );
  res.status(200).json({
    success: true,
    data,
    message: "Article approved and published live.",
  });
}

export async function rejectArticle(req, res) {
  const data = await adminService.rejectArticle(
    req.params.id,
    { id: req.auth.sub, role: req.auth.role },
    req.body,
    getReqContext(req)
  );
  res.status(200).json({
    success: true,
    data,
    message: "Article submission rejected and moved to draft.",
  });
}

export async function requestChanges(req, res) {
  const data = await adminService.requestChanges(
    req.params.id,
    { id: req.auth.sub, role: req.auth.role },
    req.body,
    getReqContext(req)
  );
  res.status(200).json({
    success: true,
    data,
    message: "Revisions requested and returned to author.",
  });
}

// ---------- Users Management ----------

export async function listUsers(req, res) {
  const data = await adminService.listUsers(req.query);
  res.status(200).json({ success: true, data });
}

export async function updateUserRole(req, res) {
  const data = await adminService.updateUserRole(
    req.params.id,
    { id: req.auth.sub, role: req.auth.role },
    req.body,
    getReqContext(req)
  );
  res.status(200).json({
    success: true,
    data,
    message: `User role updated to ${req.body.role}.`,
  });
}

// ---------- Audit Logs ----------

export async function listAuditLogs(req, res) {
  const data = await adminService.listAuditLogs(req.query);
  res.status(200).json({ success: true, data });
}

// ---------- System Settings ----------

export async function getSettings(req, res) {
  const data = await adminService.getSystemSettings();
  res.status(200).json({ success: true, data });
}

export async function updateSettings(req, res) {
  const data = await adminService.updateSystemSettings(
    req.body,
    { id: req.auth.sub, role: req.auth.role },
    getReqContext(req)
  );
  res.status(200).json({
    success: true,
    data,
    message: "System settings updated successfully.",
  });
}
