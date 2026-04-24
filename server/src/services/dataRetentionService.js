/**
 * Data Retention Service
 * Auto-purge stale audit logs and anonymized data after configurable retention period.
 * Designed to run on a schedule (cron or manual trigger).
 */

const AuditLog = require('../models/AuditLog');
const Payment = require('../models/Payment');

const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS, 10) || 365;

/**
 * Purge audit logs older than the retention period.
 * @returns {Object} { purged: number, retentionDays: number }
 */
const purgeAuditLogs = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const result = await AuditLog.deleteMany({
    createdAt: { $lt: cutoff },
  });

  return {
    purged: result.deletedCount,
    retentionDays: RETENTION_DAYS,
    cutoffDate: cutoff.toISOString(),
  };
};

/**
 * Archive old completed payment records.
 * Doesn't delete — marks as archived for reduced query load.
 * @returns {Object} { archived: number }
 */
const archiveOldPayments = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const result = await Payment.updateMany(
    {
      status: 'paid',
      paidDate: { $lt: cutoff },
      archived: { $ne: true },
    },
    { $set: { archived: true } }
  );

  return {
    archived: result.modifiedCount,
    retentionDays: RETENTION_DAYS,
  };
};

/**
 * Run all retention tasks.
 */
const runRetention = async () => {
  const auditResult = await purgeAuditLogs();
  const paymentResult = await archiveOldPayments();

  console.log(`[Retention] Audit logs purged: ${auditResult.purged}, Payments archived: ${paymentResult.archived}`);

  return { auditLogs: auditResult, payments: paymentResult };
};

module.exports = { purgeAuditLogs, archiveOldPayments, runRetention, RETENTION_DAYS };
