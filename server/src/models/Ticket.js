const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const ticketSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ticket must have a resident'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'cleaning', 'furniture', 'appliance', 'internet', 'bug', 'defect', 'feature', 'scope-change', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['raised', 'assigned', 'in-progress', 'resolved', 'closed'],
      default: 'raised',
    },
    media: [
      {
        url: String,
        type: { type: String, enum: ['image', 'video'] },
      },
    ],
    assignedTo: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    resolution: {
      type: String,
      enum: ['fixed', 'wont-fix', 'duplicate', 'deferred', 'not-a-bug', ''],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.index({ property: 1, status: 1 });
ticketSchema.index({ resident: 1 });

ticketSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Ticket', ticketSchema);
