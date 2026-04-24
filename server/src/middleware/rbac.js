const Permission = require('../models/Permission');

/**
 * RBAC Middleware — Granular permission checking.
 * Checks the Permission collection for the user's role + requested resource + action.
 *
 * Usage: rbac('properties', 'create')
 */
const rbac = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Admin bypass — admins have all permissions
      if (req.user.role === 'admin') {
        return next();
      }

      const permission = await Permission.findOne({
        role: req.user.role,
        resource,
      }).lean();

      if (!permission) {
        return res.status(403).json({
          success: false,
          message: `Role '${req.user.role}' has no permissions for '${resource}'`,
        });
      }

      if (!permission.actions.includes(action) && !permission.actions.includes('manage')) {
        return res.status(403).json({
          success: false,
          message: `Role '${req.user.role}' cannot '${action}' on '${resource}'`,
        });
      }

      // Attach permission metadata for controllers to use
      req.permission = permission;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user can only access own resources.
 * Must be used AFTER rbac() middleware.
 */
const ownOnly = (ownerField = 'user') => {
  return (req, res, next) => {
    if (req.permission?.conditions?.ownOnly) {
      req.ownOnlyFilter = { [ownerField]: req.user._id };
    }
    next();
  };
};

module.exports = { rbac, ownOnly };
