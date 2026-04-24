const Payment = require('../models/Payment');
const Property = require('../models/Property');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get dashboard summary cards
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'owner') {
      const myProperties = await Property.find({ owner: req.user._id }).select('_id');
      filter.property = { $in: myProperties.map(p => p._id) };
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalProperties,
      totalRooms,
      occupiedRooms,
      totalTenants,
      monthPayments,
      overduePayments,
    ] = await Promise.all([
      Property.countDocuments(req.user.role === 'owner' ? { owner: req.user._id } : {}),
      Room.countDocuments(filter.property ? { property: filter.property } : {}),
      Room.countDocuments({ ...(filter.property ? { property: filter.property } : {}), status: 'occupied' }),
      User.countDocuments({ role: 'resident' }),
      Payment.aggregate([
        { $match: { ...filter, status: 'paid', paidDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
      Payment.countDocuments({ ...filter, status: 'overdue' }),
    ]);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const monthRevenue = monthPayments[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalRevenue: monthRevenue,
        totalProperties,
        totalRooms,
        occupiedRooms,
        occupancyRate,
        totalTenants,
        overduePayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue time-series (last 6 months)
// @route   GET /api/dashboard/revenue
// @access  Private/Owner/Admin
const getRevenue = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months, 10) || 6;
    const now = new Date();

    const pipeline = [
      {
        $match: {
          status: 'paid',
          paidDate: {
            $gte: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' },
          },
          revenue: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ];

    const data = await Payment.aggregate(pipeline);

    // Fill gaps with zeros
    const labels = [];
    const values = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const match = data.find(
        (r) => r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1
      );
      labels.push(label);
      values.push(match ? match.revenue : 0);
    }

    res.json({ success: true, data: { labels, values } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get occupancy breakdown by property
// @route   GET /api/dashboard/occupancy
// @access  Private/Owner/Admin
const getOccupancy = async (req, res, next) => {
  try {
    const properties = await Property.find(
      req.user.role === 'owner' ? { owner: req.user._id } : {}
    ).select('name');

    const data = [];

    for (const prop of properties) {
      const [total, occupied] = await Promise.all([
        Room.countDocuments({ property: prop._id }),
        Room.countDocuments({ property: prop._id, status: 'occupied' }),
      ]);
      data.push({
        name: prop.name,
        total,
        occupied,
        vacant: total - occupied,
        rate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment status distribution
// @route   GET /api/dashboard/payment-status
// @access  Private/Owner/Admin
const getPaymentStatus = async (req, res, next) => {
  try {
    const billingMonth = req.query.billingMonth ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    const distribution = await Payment.aggregate([
      { $match: { billingMonth } },
      { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
    ]);

    const result = { paid: 0, pending: 0, overdue: 0, partial: 0 };
    const amounts = { paid: 0, pending: 0, overdue: 0, partial: 0 };

    for (const d of distribution) {
      if (result[d._id] !== undefined) {
        result[d._id] = d.count;
        amounts[d._id] = d.amount;
      }
    }

    res.json({ success: true, data: { counts: result, amounts } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getRevenue, getOccupancy, getPaymentStatus };
