const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const leaveLogSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      default: '',
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ['night-out', 'leave', 'guest-visit'],
      default: 'night-out',
    },
    guestInfo: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    qrCode: {
      type: String,
      default: () => uuidv4(),
    },
    qrExpiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

leaveLogSchema.index({ resident: 1, fromDate: 1 });

module.exports = mongoose.model('LeaveLog', leaveLogSchema);
