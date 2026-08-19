import AuditLog from "../models/AuditLog.js";

/**
 * Express middleware to automatically log designated mutation events.
 * @param {string} actionName - Name of the action (e.g. "ARTICLE_CREATE", "SETTINGS_UPDATE")
 * @param {string} targetType - Target type ("Article", "User", "Comment", "System", "Topic")
 * @param {Function} [getTargetId] - Optional callback (req, res) => targetId
 */
export function recordAudit(actionName, targetType, getTargetId) {
  return async (req, res, next) => {
    // Intercept res.json to capture response status and payload
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only log on successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.auth) {
        const actorId = req.auth.sub;
        let targetId = null;
        if (getTargetId) {
          try {
            targetId = getTargetId(req, body);
          } catch {
            targetId = req.params?.id || null;
          }
        } else {
          targetId = req.params?.id || body?.data?._id || null;
        }

        // Sanitize details to avoid logging sensitive data (passwords, tokens)
        const details = { ...req.body };
        delete details.password;
        delete details.confirmPassword;
        delete details.token;
        delete details.refreshToken;

        AuditLog.create({
          action: actionName,
          actor: actorId,
          targetType: targetType || "System",
          targetId: targetId ? targetId.toString() : undefined,
          details,
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.get("user-agent") || "unknown",
        }).catch((err) => {
          console.error("Failed to record audit log:", err.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
}
