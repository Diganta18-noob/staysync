const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const bookingSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a resident'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Booking must have a room'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Booking must have a property'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    depositAmount: {
      type: Number,
      required: [true, 'Deposit amount is required'],
      min: 0,
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: 0,
    },
    proRataAmount: {
      type: Number,
      default: 0,
    },
    totalFirstPayment: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    stripeSessionId: {
      type: String,
    },
    contractUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['move-in', 'move-out', 'renewal'],
      default: 'move-in',
    },
  },
  {
    timestamps: true,
  }
);

// Index
bookingSchema.index({ resident: 1, status: 1 });
bookingSchema.index({ property: 1, status: 1 });

bookingSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Booking', bookingSchema);
