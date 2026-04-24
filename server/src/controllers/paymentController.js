const Payment = require('../models/Payment');
const { generateMonthlyRent, processOverduePayments, recordPayment, getPaymentSummary } = require('../services/rentCycleService');

// @desc    Get all payments (with filters)
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const filter = {};

    // Role-based filtering
    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    } else if (req.user.role === 'owner') {
      if (req.query.property) filter.property = req.query.property;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.billingMonth) filter.billingMonth = req.query.billingMonth;
    if (req.query.resident) filter.resident = req.query.resident;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('resident', 'name email phone')
        .populate('property', 'name address')
        .populate('room', 'roomNumber floor')
        .sort('-dueDate')
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('resident', 'name email phone profileImage')
      .populate('property', 'name address')
      .populate('room', 'roomNumber floor price');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Residents can only view their own payments
    if (req.user.role === 'resident' && payment.resident._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a manual payment record
// @route   POST /api/payments
// @access  Private/Owner/Admin
const createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      generatedBy: 'manual',
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a payment (mark as paid/partial)
// @route   PUT /api/payments/:id/pay
// @access  Private/Owner/Admin
const payPayment = async (req, res, next) => {
  try {
    const { amount, method, transactionId } = req.body;

    if (!amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'Amount and payment method are required',
      });
    }

    const payment = await recordPayment(req.params.id, amount, method, transactionId);

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate bulk rent for a property
// @route   POST /api/payments/generate
// @access  Private/Owner/Admin
const generateRent = async (req, res, next) => {
  try {
    const { propertyId, billingMonth, lateFeePct } = req.body;

    if (!propertyId || !billingMonth) {
      return res.status(400).json({
        success: false,
        message: 'propertyId and billingMonth (YYYY-MM) are required',
      });
    }

    const result = await generateMonthlyRent(propertyId, billingMonth, lateFeePct);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Process overdue payments (cron-friendly)
// @route   POST /api/payments/process-overdue
// @access  Private/Admin
const processOverdue = async (req, res, next) => {
  try {
    const result = await processOverduePayments();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment summary for a property
// @route   GET /api/payments/summary/:propertyId
// @access  Private/Owner/Admin
const getSummary = async (req, res, next) => {
  try {
    const summary = await getPaymentSummary(
      req.params.propertyId,
      req.query.billingMonth || null
    );
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  payPayment,
  generateRent,
  processOverdue,
  getSummary,
};
