const AuditLog = require('../models/AuditLog');

/**
 * Auto-capture audit middleware.
 * Wraps mutation endpoints (POST/PUT/DELETE) to automatically log before/after states.
 *
 * Usage: router.put('/:id', protect, auditCapture('PROPERTY_UPDATED', 'property'), updateProperty)
 */
const auditCapture = (action, resourceType = 'system') => {
  return async (req, res, next) => {
    // Capture the original json method to intercept the response
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only log on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const logEntry = {
          action,
          performedBy: req.user._id,
          performedByName: req.user.name || req.user.email,
          performedByRole: req.user.role,
          resourceType,
          ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
          details: {
            method: req.method,
            path: req.originalUrl,
            userAgent: req.headers['user-agent'] || 'unknown',
            body: sanitizeBody(req.body),
          },
        };

        // Add target info if available
        if (req.params.id) {
          logEntry.targetResource = req.params.id;
        }

        // Non-blocking — fire and forget
        AuditLog.create(logEntry).catch((err) => {
          console.error('[Audit] Failed to log:', err.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
};

/**
 * Sanitize request body to remove sensitive fields before logging.
 */
function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return {};

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'refreshToken', 'secret', 'apiKey', 'creditCard'];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

module.exports = { auditCapture };
