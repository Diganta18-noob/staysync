/**
 * GDPR Middleware — Data privacy compliance tooling.
 * Handles consent tracking, data anonymization, and right-to-be-forgotten.
 */

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

/**
 * Middleware: Add GDPR-related headers.
 */
const gdprHeaders = (req, res, next) => {
  // Inform clients about data processing
  res.setHeader('X-Data-Processing', 'legitimate-interest');
  res.setHeader('X-Privacy-Policy', '/privacy-policy');
  next();
};

/**
 * Export all personal data for a user (GDPR Article 20 — Data Portability).
 * @route GET /api/users/me/data-export
 */
const exportPersonalData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [user, payments, bookings, auditLogs] = await Promise.all([
      User.findById(userId).select('-password -__v').lean(),
      Payment.find({ resident: userId }).select('-__v').lean(),
      Booking.find({ user: userId }).select('-__v').lean(),
      AuditLog.find({ performedBy: userId }).select('-__v').sort('-createdAt').limit(500).lean(),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      subject: 'GDPR Data Export — StaySync',
      userData: user,
      payments,
      bookings,
      auditLogs,
      metadata: {
        totalPayments: payments.length,
        totalBookings: bookings.length,
        totalAuditEntries: auditLogs.length,
      },
    };

    // Log the export action
    await AuditLog.create({
      action: 'DATA_EXPORT',
      performedBy: userId,
      performedByName: req.user.name || req.user.email,
      performedByRole: req.user.role,
      details: { type: 'personal_data_export' },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="staysync-data-export-${userId}.json"`);
    res.json(exportData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account and anonymize personal data (GDPR Article 17 — Right to Erasure).
 * @route DELETE /api/users/me
 */
const deleteMyAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name || req.user.email;

    // Anonymize user data (don't hard delete for referential integrity)
    await User.findByIdAndUpdate(userId, {
      name: '[DELETED USER]',
      email: `deleted-${userId}@anonymized.staysync`,
      phone: null,
      profileImage: null,
      password: 'DELETED',
      kycDocuments: [],
      kycStatus: 'not_submitted',
      isActive: false,
    });

    // Anonymize audit logs — keep the action record but remove PII
    await AuditLog.updateMany(
      { performedBy: userId },
      {
        performedByName: '[DELETED USER]',
        details: { anonymized: true, originalAction: 'preserved' },
      }
    );

    // Log the deletion
    await AuditLog.create({
      action: 'ACCOUNT_DELETED',
      performedBy: userId,
      performedByName: '[SYSTEM]',
      performedByRole: 'system',
      details: {
        originalName: userName,
        reason: 'GDPR right to erasure',
        anonymizedAt: new Date(),
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: 'Account deleted and personal data anonymized per GDPR Article 17',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { gdprHeaders, exportPersonalData, deleteMyAccount };
