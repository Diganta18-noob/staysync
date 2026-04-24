const AuditLog = require('../models/AuditLog');

/**
 * Log an audit event.
 * @param {Object} options
 * @param {Object} options.req - Express request (used to extract user & IP)
 * @param {string} options.action - The action type (e.g. 'ROLE_CHANGED')
 * @param {string} [options.targetUserId] - ID of affected user
 * @param {string} [options.targetUserName] - Name of affected user
 * @param {string} [options.targetResource] - ID of affected resource
 * @param {string} [options.resourceType] - Type of resource
 * @param {Object} [options.details] - Extra details (before/after, etc.)
 */
const logAudit = async ({ req, action, targetUserId, targetUserName, targetResource, resourceType, details }) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await AuditLog.create({
      action,
      performedBy: req.user?._id || req.user?.id,
      performedByName: req.user?.name || 'System',
      performedByRole: req.user?.role || 'admin',
      targetUser: targetUserId || undefined,
      targetUserName: targetUserName || undefined,
      targetResource: targetResource || undefined,
      resourceType: resourceType || undefined,
      details: details || {},
      ipAddress: ip,
      userAgent: userAgent,
    });
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err.message);
  }
};

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

module.exports = { auditCapture, logAudit };
