const Property = require('../models/Property');
const Room = require('../models/Room');

// @desc    Get all properties (with search & filter)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    // Search by text
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Filter by city
    if (req.query.city) {
      filter['address.city'] = new RegExp(req.query.city, 'i');
    }

    // Filter by amenities
    if (req.query.amenities) {
      const amenitiesList = req.query.amenities.split(',');
      filter.amenities = { $all: amenitiesList };
    }

    // Filter by food options
    if (req.query.food) {
      filter.foodOptions = req.query.food;
    }

    // Filter by property type
    if (req.query.type) {
      filter.propertyType = req.query.type;
    }

    // Filter by gender
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    // Filter by sharing type — need to check rooms
    let propertyIdsWithSharing;
    if (req.query.sharing) {
      const sharingType = parseInt(req.query.sharing, 10);
      const rooms = await Room.find({ sharingType, isAvailable: true }).distinct('property');
      propertyIdsWithSharing = rooms;
      filter._id = { $in: propertyIdsWithSharing };
    }

    // Sort
    let sort = '-createdAt';
    if (req.query.sort === 'price-low') sort = 'rooms.pricePerBed';
    if (req.query.sort === 'price-high') sort = '-rooms.pricePerBed';
    if (req.query.sort === 'rating') sort = '-rating';

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort(sort),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone profileImage')
      .populate('rooms');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Owner,Admin
const createProperty = async (req, res, next) => {
  try {
    req.body.owner = req.user._id;

    const property = await Property.create(req.body);

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Owner,Admin
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ensure owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Owner,Admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    // Delete all rooms associated with this property
    await Room.deleteMany({ property: property._id });
    await Property.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties by owner
// @route   GET /api/properties/my
// @access  Private/Owner
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('rooms')
      .sort('-createdAt');

    res.json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
