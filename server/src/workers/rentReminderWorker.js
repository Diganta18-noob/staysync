/**
 * Rent Reminder Worker
 * Processes upcoming and overdue payments, sends email reminders.
 * Designed to be triggered by a cron job or queue scheduler.
 */

const Payment = require('../models/Payment');
const { sendEmail } = require('../services/emailService');
const { addJob, registerHandler, createQueue } = require('../services/queueService');

const QUEUE_NAME = 'rent-reminders';

// Register the handler
registerHandler(QUEUE_NAME, async (data) => {
  const { paymentId } = data;

  const payment = await Payment.findById(paymentId)
    .populate('resident', 'name email')
    .populate('property', 'name')
    .populate('room', 'roomNumber')
    .lean();

  if (!payment || !payment.resident?.email) return;

  const isOverdue = payment.status === 'overdue';
  const template = isOverdue ? 'rentDue' : 'rentDue';

  await sendEmail(payment.resident.email, template, {
    name: payment.resident.name,
    amount: payment.amount + (payment.lateFeeAmount || 0),
    billingMonth: payment.billingMonth,
    propertyName: payment.property?.name || 'N/A',
    roomNumber: payment.room?.roomNumber || 'N/A',
    dueDate: payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-IN') : 'N/A',
  });
});

createQueue(QUEUE_NAME);

/**
 * Check for upcoming/overdue payments and queue reminders.
 * Call this from a cron endpoint or scheduler.
 */
const processRentReminders = async () => {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Find payments due within 3 days or already overdue
  const payments = await Payment.find({
    $or: [
      { status: 'pending', dueDate: { $lte: threeDaysFromNow } },
      { status: 'overdue' },
    ],
  }).select('_id');

  const results = { queued: 0 };

  for (const payment of payments) {
    await addJob(QUEUE_NAME, { paymentId: payment._id.toString() });
    results.queued++;
  }

  return results;
};

module.exports = { processRentReminders };
