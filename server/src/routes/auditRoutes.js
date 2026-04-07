const express = require('express');
const { getAuditLogs, getAuditStats } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All audit routes require admin access
router.use(protect, authorize('admin'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);

module.exports = router;
