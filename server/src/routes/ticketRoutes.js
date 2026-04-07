const express = require('express');
const { createTicket, getTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/', protect, getTickets);
router.put('/:id', protect, authorize('owner', 'admin'), updateTicket);
router.delete('/:id', protect, authorize('admin'), deleteTicket);

module.exports = router;
