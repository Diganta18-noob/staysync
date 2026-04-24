const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident is required'],
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partial', 'waived'],
      default: 'pending',
      index: true,
    },
    type: {
      type: String,
      enum: ['rent', 'deposit', 'electricity', 'maintenance', 'penalty', 'other'],
      default: 'rent',
    },
    lateFeePct: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lateFeeAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'bank_transfer', 'card', 'auto_debit', 'other'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    generatedBy: {
      type: String,
      enum: ['system', 'manual'],
      default: 'manual',
    },
    billingMonth: {
      type: String, // Format: "2026-04"
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
paymentSchema.index({ resident: 1, billingMonth: 1 });
paymentSchema.index({ property: 1, status: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });

// Virtual: check if overdue
paymentSchema.virtual('isOverdue').get(function () {
  return this.status === 'pending' && this.dueDate < new Date();
});

// Pre-save: auto-set status to overdue
paymentSchema.pre('save', function (next) {
  if (this.status === 'pending' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  if (this.paidAmount >= this.amount && this.status !== 'waived') {
    this.status = 'paid';
    if (!this.paidDate) this.paidDate = new Date();
  } else if (this.paidAmount > 0 && this.paidAmount < this.amount) {
    this.status = 'partial';
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
