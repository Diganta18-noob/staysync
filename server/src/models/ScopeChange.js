const mongoose = require('mongoose');

const scopeChangeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected', 'implemented'],
      default: 'draft',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    impact: {
      timeline: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major'],
        default: 'none',
      },
      budget: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major'],
        default: 'none',
      },
      resources: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major'],
        default: 'none',
      },
    },
    justification: {
      type: String,
      maxlength: 1000,
    },
    affectedPhase: {
      type: String,
      trim: true,
    },
    reviewNotes: {
      type: String,
      maxlength: 1000,
    },
    reviewedAt: {
      type: Date,
    },
    implementedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

scopeChangeSchema.index({ requestedBy: 1, status: 1 });
scopeChangeSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('ScopeChange', scopeChangeSchema);
