const AuditLog = require('../models/AuditLog');

// @desc    Get audit logs
// @route   GET /api/audit
// @access  Private/Admin
const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by action type
    if (req.query.action) {
      filter.action = req.query.action;
    }

    // Filter by performer
    if (req.query.performedBy) {
      filter.performedBy = req.query.performedBy;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // Search in performedByName or targetUserName
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { performedByName: searchRegex },
        { targetUserName: searchRegex },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit log stats
// @route   GET /api/audit/stats
// @access  Private/Admin
const getAuditStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalLogs, todayLogs, actionCounts, recentActivity] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({ createdAt: { $gte: today } }),
      AuditLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.find()
        .sort('-createdAt')
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalLogs,
        todayLogs,
        actionCounts: actionCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs, getAuditStats };
