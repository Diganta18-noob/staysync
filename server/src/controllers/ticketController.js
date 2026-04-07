const Ticket = require('../models/Ticket');

// @desc    Create ticket
// @route   POST /api/tickets
// @access  Private/Resident
const createTicket = async (req, res, next) => {
  try {
    req.body.resident = req.user._id;
    const ticket = await Ticket.create(req.body);

    // Emit socket event for real-time notification
    if (req.app.get('io')) {
      req.app.get('io').emit('ticket:new', {
        ticket,
        message: `New ticket raised: ${ticket.title}`,
      });
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.property) filter.property = req.query.property;

    const tickets = await Ticket.find(filter)
      .populate('resident', 'name email phone profileImage')
      .populate('property', 'title')
      .populate('room', 'roomNumber')
      .sort('-createdAt');

    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id
// @access  Private/Owner,Admin
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const allowedUpdates = ['status', 'assignedTo', 'priority', 'resolutionNotes'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    if (req.body.status === 'resolved') {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('ticket:updated', {
        ticket,
        message: `Ticket "${ticket.title}" updated to ${ticket.status}`,
      });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, getTickets, updateTicket, deleteTicket };
