const express = require('express');
const {
  createBooking, getBookings, approveBooking, rejectBooking, createCheckout,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id/approve', protect, authorize('owner', 'admin'), approveBooking);
router.put('/:id/reject', protect, authorize('owner', 'admin'), rejectBooking);
router.post('/:id/checkout', protect, createCheckout);

module.exports = router;
