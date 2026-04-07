const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Property = require('../models/Property');
const User = require('../models/User');
const { calculateProRata } = require('../utils/proRata');
const { createCheckoutSession } = require('../services/stripeService');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private/Resident
const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.availableBeds <= 0) {
      return res.status(400).json({ success: false, message: 'No beds available' });
    }

    // Check if room is locked by someone else
    if (room.isLocked() && room.lockedBy?.toString() !== req.user._id.toString()) {
      return res.status(423).json({ success: false, message: 'Room is locked by another user' });
    }

    // Calculate pro-rata rent
    const { proRataAmount } = calculateProRata(room.pricePerBed, startDate);

    const depositAmount = room.pricePerBed; // 1 month as deposit
    const totalFirstPayment = depositAmount + proRataAmount;

    const booking = await Booking.create({
      resident: req.user._id,
      room: room._id,
      property: room.property,
      startDate,
      depositAmount,
      monthlyRent: room.pricePerBed,
      proRataAmount,
      totalFirstPayment,
      type: 'move-in',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filter = {};

    // Role-based filtering
    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    } else if (req.user.role === 'owner') {
      // Get owner's properties
      const properties = await Property.find({ owner: req.user._id }).select('_id');
      const propertyIds = properties.map((p) => p._id);
      filter.property = { $in: propertyIds };
    }
    // Admin sees all

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('resident', 'name email phone profileImage')
        .populate('room', 'roomNumber sharingType pricePerBed')
        .populate('property', 'title address')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt'),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private/Owner,Admin
const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Booking is not in pending status' });
    }

    // Update room occupancy
    const room = await Room.findById(booking.room);
    room.occupiedBeds += 1;
    if (room.occupiedBeds >= room.totalBeds) {
      room.isAvailable = false;
    }
    await room.save();

    // Update property occupancy
    await Property.findByIdAndUpdate(booking.property, { $inc: { occupiedBeds: 1 } });

    // Update user's current room
    await User.findByIdAndUpdate(booking.resident, { currentRoom: booking.room });

    booking.status = 'approved';
    await booking.save();

    // Send confirmation email
    const user = await User.findById(booking.resident);
    sendBookingConfirmation(user, booking).catch(console.error);

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject booking
// @route   PUT /api/bookings/:id/reject
// @access  Private/Owner,Admin
const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Unlock the room
    const room = await Room.findById(booking.room);
    if (room) await room.unlock();

    booking.status = 'rejected';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Stripe checkout
// @route   POST /api/bookings/:id/checkout
// @access  Private/Resident
const createCheckout = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const session = await createCheckoutSession({ booking, user: req.user });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.json({ success: true, data: { checkoutUrl: session.url } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  approveBooking,
  rejectBooking,
  createCheckout,
};
