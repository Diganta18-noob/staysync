const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'owner', 'resident'],
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
      // e.g., 'properties', 'rooms', 'bookings', 'payments', 'users', 'audit', 'tickets', 'dashboard'
    },
    actions: {
      type: [String],
      enum: ['create', 'read', 'update', 'delete', 'export', 'manage'],
      default: ['read'],
    },
    conditions: {
      ownOnly: { type: Boolean, default: false }, // Can only act on own resources
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast permission lookups
permissionSchema.index({ role: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);
