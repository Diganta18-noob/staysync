const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'ADMIN_LOGIN', 'USER_LOGIN', 'USER_REGISTERED',
        'ROLE_CHANGED', 'KYC_APPROVED', 'KYC_REJECTED',
        'PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_DELETED',
        'BOOKING_CREATED', 'BOOKING_CANCELLED',
        'TICKET_CREATED', 'TICKET_RESOLVED',
        'USER_DELETED', 'SETTINGS_UPDATED',
      ],
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      enum: ['admin', 'owner', 'resident'],
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetUserName: {
      type: String,
    },
    targetResource: {
      type: String,
    },
    resourceType: {
      type: String,
      enum: ['user', 'property', 'booking', 'ticket', 'room', 'system'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
