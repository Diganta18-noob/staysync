const express = require('express');
const {
  getPayments, getPayment, createPayment,
  payPayment, generateRent, processOverdue, getSummary,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { cacheControl, generateETag, clearCache } = require('../middleware/cacheMiddleware');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// Resident + Owner + Admin can view payments (filtered by role in controller)
router.get('/', generateETag, cacheControl(60), getPayments);
router.get('/:id', generateETag, cacheControl(60), getPayment);

// Owner/Admin: create manual payments
router.post('/', authorize('owner', 'admin'), clearCache, createPayment);

// Owner/Admin: record a payment against existing record
router.put('/:id/pay', authorize('owner', 'admin'), clearCache, payPayment);

// Owner/Admin: generate bulk monthly rent
router.post('/generate', authorize('owner', 'admin'), clearCache, generateRent);

// Admin: process overdue payments
router.post('/process-overdue', authorize('admin'), clearCache, processOverdue);

// Owner/Admin: get payment summary for a property
router.get('/summary/:propertyId', authorize('owner', 'admin'), generateETag, cacheControl(120), getSummary);

module.exports = router;
