const express = require('express');
const { getStats, getRevenue, getOccupancy, getPaymentStatus } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { cacheControl, generateETag } = require('../middleware/cacheMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', generateETag, cacheControl(120), getStats);
router.get('/revenue', generateETag, cacheControl(300), getRevenue);
router.get('/occupancy', generateETag, cacheControl(300), getOccupancy);
router.get('/payment-status', generateETag, cacheControl(120), getPaymentStatus);

module.exports = router;
