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
    });
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err.message);
  }
};

module.exports = { logAudit };
