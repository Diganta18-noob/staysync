const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Room must belong to a property'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    floor: {
      type: Number,
      default: 0,
    },
    sharingType: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: [true, 'Sharing type is required'],
    },
    pricePerBed: {
      type: Number,
      required: [true, 'Price per bed is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalBeds: {
      type: Number,
      required: [true, 'Total beds is required'],
      min: [1, 'Must have at least 1 bed'],
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
    // Slot locking for booking
    lockedUntil: {
      type: Date,
      default: null,
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: available beds
roomSchema.virtual('availableBeds').get(function () {
  return this.totalBeds - this.occupiedBeds;
});

// Check if room is currently locked
roomSchema.methods.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > new Date();
};

// Lock the room for 10 minutes
roomSchema.methods.lockForBooking = function (userId) {
  this.lockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.lockedBy = userId;
  return this.save();
};

// Unlock the room
roomSchema.methods.unlock = function () {
  this.lockedUntil = null;
  this.lockedBy = null;
  return this.save();
};

// Index
roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
