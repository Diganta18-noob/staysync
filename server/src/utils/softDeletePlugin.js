const mongoose = require('mongoose');

/**
 * Applies soft-delete functionality to a Mongoose schema.
 * Adds a `deletedAt` field and overrides find/countDocuments
 * to automatically exclude soft-deleted documents.
 */
const softDeletePlugin = (schema) => {
  // Add deletedAt field
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  });

  // Override find queries to exclude soft-deleted docs by default
  const excludeDeleted = function (next) {
    if (this.getFilter().deletedAt === undefined) {
      this.where({ deletedAt: null });
    }
    next();
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  // Instance method: soft delete
  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save({ validateModifiedOnly: true });
  };

  // Instance method: restore
  schema.methods.restore = function () {
    this.deletedAt = null;
    return this.save({ validateModifiedOnly: true });
  };

  // Static method: find including deleted
  schema.statics.findWithDeleted = function (filter = {}) {
    return this.find({ ...filter, deletedAt: { $exists: true } });
  };

  // Static method: find only deleted 
  schema.statics.findDeleted = function (filter = {}) {
    return this.find({ ...filter, deletedAt: { $ne: null } });
  };
};

module.exports = softDeletePlugin;
