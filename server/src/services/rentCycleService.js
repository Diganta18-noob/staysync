const Payment = require('../models/Payment');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

/**
 * Rent Cycle Service
 * Handles automatic monthly rent generation, overdue detection, and late fee calculation.
 */

/**
 * Generate monthly rent payments for all active bookings in a property.
 * @param {string} propertyId - The property to generate rents for
 * @param {string} billingMonth - Format "YYYY-MM" (e.g., "2026-04")
 * @param {number} lateFeePct - Late fee percentage (default 5%)
 * @returns {Object} { generated: number, skipped: number, errors: string[] }
 */
exports.generateMonthlyRent = async (propertyId, billingMonth, lateFeePct = 5) => {
  const results = { generated: 0, skipped: 0, errors: [] };

  try {
    // Find all active bookings for this property
    const activeBookings = await Booking.find({
      property: propertyId,
      status: 'approved',
    }).populate('user room');

    for (const booking of activeBookings) {
      try {
        // Check if payment already exists for this month
        const existing = await Payment.findOne({
          resident: booking.user._id,
          property: propertyId,
          room: booking.room._id,
          billingMonth,
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Calculate due date (5th of the billing month)
        const [year, month] = billingMonth.split('-').map(Number);
        const dueDate = new Date(year, month - 1, 5); // 5th of the month

        // Create payment record
        await Payment.create({
          resident: booking.user._id,
          property: propertyId,
          room: booking.room._id,
          amount: booking.room.price || 0,
          dueDate,
          status: dueDate < new Date() ? 'overdue' : 'pending',
          type: 'rent',
          lateFeePct,
          billingMonth,
          generatedBy: 'system',
        });

        results.generated++;
      } catch (err) {
        results.errors.push(`Booking ${booking._id}: ${err.message}`);
      }
    }
  } catch (err) {
    results.errors.push(`Property ${propertyId}: ${err.message}`);
  }

  return results;
};

/**
 * Mark overdue payments and apply late fees.
 * @returns {Object} { updated: number }
 */
exports.processOverduePayments = async () => {
  const now = new Date();

  const overduePayments = await Payment.find({
    status: 'pending',
    dueDate: { $lt: now },
  });

  let updated = 0;

  for (const payment of overduePayments) {
    payment.status = 'overdue';
    if (payment.lateFeePct > 0) {
      payment.lateFeeAmount = Math.round((payment.amount * payment.lateFeePct) / 100);
    }
    await payment.save();
    updated++;
  }

  return { updated };
};

/**
 * Record a payment against an existing payment record.
 * @param {string} paymentId - The payment record ID
 * @param {number} amount - Amount being paid
 * @param {string} method - Payment method (cash, upi, etc.)
 * @param {string} transactionId - Optional transaction reference
 * @returns {Object} Updated payment document
 */
exports.recordPayment = async (paymentId, amount, method, transactionId = null) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error('Payment record not found');

  const totalDue = payment.amount + (payment.lateFeeAmount || 0);
  payment.paidAmount = (payment.paidAmount || 0) + amount;
  payment.paymentMethod = method;
  if (transactionId) payment.transactionId = transactionId;

  if (payment.paidAmount >= totalDue) {
    payment.status = 'paid';
    payment.paidDate = new Date();
  } else {
    payment.status = 'partial';
  }

  await payment.save();
  return payment;
};

/**
 * Get payment summary for a property.
 * @param {string} propertyId
 * @param {string} billingMonth - Optional filter
 * @returns {Object} Summary with totals
 */
exports.getPaymentSummary = async (propertyId, billingMonth = null) => {
  const filter = { property: propertyId };
  if (billingMonth) filter.billingMonth = billingMonth;

  const payments = await Payment.find(filter).lean();

  const summary = {
    total: payments.length,
    totalAmount: 0,
    collected: 0,
    pending: 0,
    overdue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    collectedAmount: 0,
  };

  for (const p of payments) {
    summary.totalAmount += p.amount + (p.lateFeeAmount || 0);
    if (p.status === 'paid') {
      summary.collected++;
      summary.collectedAmount += p.paidAmount || p.amount;
    } else if (p.status === 'overdue') {
      summary.overdue++;
      summary.overdueAmount += p.amount + (p.lateFeeAmount || 0) - (p.paidAmount || 0);
    } else {
      summary.pending++;
      summary.pendingAmount += p.amount - (p.paidAmount || 0);
    }
  }

  return summary;
};
