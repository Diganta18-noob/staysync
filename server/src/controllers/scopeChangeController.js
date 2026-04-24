const ScopeChange = require('../models/ScopeChange');

// @desc    Get all scope change requests
// @route   GET /api/scope-changes
// @access  Private
const getScopeChanges = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    // Non-admins see only their own
    if (req.user.role !== 'admin') {
      filter.requestedBy = req.user._id;
    }

    const [items, total] = await Promise.all([
      ScopeChange.find(filter)
        .populate('requestedBy', 'name email')
        .populate('approvedBy', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      ScopeChange.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scope change
// @route   GET /api/scope-changes/:id
// @access  Private
const getScopeChange = async (req, res, next) => {
  try {
    const item = await ScopeChange.findById(req.params.id)
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Scope change not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create scope change request
// @route   POST /api/scope-changes
// @access  Private
const createScopeChange = async (req, res, next) => {
  try {
    const item = await ScopeChange.create({
      ...req.body,
      requestedBy: req.user._id,
      status: 'submitted',
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Review scope change (approve/reject)
// @route   PUT /api/scope-changes/:id/review
// @access  Private/Admin
const reviewScopeChange = async (req, res, next) => {
  try {
    const { decision, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Decision must be "approved" or "rejected"',
      });
    }

    const item = await ScopeChange.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Scope change not found' });
    }

    item.status = decision;
    item.approvedBy = req.user._id;
    item.reviewNotes = reviewNotes || '';
    item.reviewedAt = new Date();

    if (decision === 'approved') {
      item.status = 'approved';
    }

    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark scope change as implemented
// @route   PUT /api/scope-changes/:id/implement
// @access  Private/Admin
const implementScopeChange = async (req, res, next) => {
  try {
    const item = await ScopeChange.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Scope change not found' });
    }

    if (item.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved scope changes can be marked as implemented',
      });
    }

    item.status = 'implemented';
    item.implementedAt = new Date();
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScopeChanges,
  getScopeChange,
  createScopeChange,
  reviewScopeChange,
  implementScopeChange,
};
