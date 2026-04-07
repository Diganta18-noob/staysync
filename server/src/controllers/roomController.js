const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc    Get rooms for a property
// @route   GET /api/properties/:propertyId/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const filter = { property: req.params.propertyId };

    if (req.query.available === 'true') {
      filter.isAvailable = true;
      filter.occupiedBeds = { $lt: filter.totalBeds };
    }

    if (req.query.sharing) {
      filter.sharingType = parseInt(req.query.sharing, 10);
    }

    const rooms = await Room.find(filter).sort('roomNumber');

    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('property');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create room
// @route   POST /api/properties/:propertyId/rooms
// @access  Private/Owner,Admin
const createRoom = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    req.body.property = req.params.propertyId;
    const room = await Room.create(req.body);

    // Update property bed count
    property.totalBeds += room.totalBeds;
    await property.save();

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Owner,Admin
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('property');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const property = await Property.findById(room.property._id || room.property);
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedRoom });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Owner,Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const property = await Property.findById(room.property);
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    property.totalBeds -= room.totalBeds;
    property.occupiedBeds -= room.occupiedBeds;
    await property.save();

    await Room.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock room for booking (10 min)
// @route   POST /api/rooms/:id/lock
// @access  Private/Resident
const lockRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.availableBeds <= 0) {
      return res.status(400).json({ success: false, message: 'No beds available in this room' });
    }

    if (room.isLocked() && room.lockedBy.toString() !== req.user._id.toString()) {
      return res.status(423).json({
        success: false,
        message: 'Room is currently locked by another user. Please try again in a few minutes.',
      });
    }

    await room.lockForBooking(req.user._id);

    res.json({
      success: true,
      message: 'Room locked for 10 minutes',
      data: { lockedUntil: room.lockedUntil },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  lockRoom,
};
