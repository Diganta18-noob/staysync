const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property must have an owner'],
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
    amenities: {
      type: [String],
      default: [],
      enum: [
        'WiFi', 'AC', 'Geyser', 'Power Backup', 'Laundry',
        'Gym', 'Parking', 'CCTV', 'Housekeeping', 'TV',
        'Refrigerator', 'Microwave', 'Water Purifier', 'Study Table',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    rules: {
      type: [String],
      default: [],
    },
    foodOptions: {
      type: String,
      enum: ['3-meals', '2-meals', 'no-food'],
      default: 'no-food',
    },
    propertyType: {
      type: String,
      enum: ['pg', 'hostel', 'coliving', 'flat'],
      default: 'pg',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalBeds: {
      type: Number,
      default: 0,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: available beds
propertySchema.virtual('availableBeds').get(function () {
  return this.totalBeds - this.occupiedBeds;
});

// Virtual: rooms
propertySchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'property',
});

// Index for search
propertySchema.index({ 'address.city': 1, amenities: 1, foodOptions: 1 });
propertySchema.index({ title: 'text', 'address.city': 'text', 'address.street': 'text' });

module.exports = mongoose.model('Property', propertySchema);
