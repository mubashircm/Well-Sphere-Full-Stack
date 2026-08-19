/**
 * Recursively sanitizes objects in place against NoSQL injection ($ and . operator keys)
 * and strips malicious script tags and javascript: URIs.
 *
 * Mutates objects in place to avoid "Cannot set property query of #<IncomingMessage>" errors in Express 5.
 */
function sanitizeInPlace(obj) {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object" && obj[i] !== null) {
        sanitizeInPlace(obj[i]);
      } else if (typeof obj[i] === "string") {
        obj[i] = obj[i]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .trim();
      }
    }
    return obj;
  }

  for (const key of Object.keys(obj)) {
    // Strip NoSQL injection operator keys ($gt, $ne, $where, etc.) or dotted keys
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInPlace(obj[key]);
    } else if (typeof obj[key] === "string") {
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
    }
  }

  return obj;
}

export function sanitizeInput(req, res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      sanitizeInPlace(req.body);
    }
    if (req.query && typeof req.query === "object") {
      sanitizeInPlace(req.query);
    }
    if (req.params && typeof req.params === "object") {
      sanitizeInPlace(req.params);
    }
    next();
  } catch (error) {
    next(error);
  }
}

export default sanitizeInput;
