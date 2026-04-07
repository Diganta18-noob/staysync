const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    meals: {
      breakfast: { type: Boolean, default: true },
      lunch: { type: Boolean, default: true },
      dinner: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

mealLogSchema.index({ resident: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MealLog', mealLogSchema);
