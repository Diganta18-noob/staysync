const Property = require('../models/Property');
const User = require('../models/User');
const Room = require('../models/Room');

/**
 * Unified search service.
 * Searches across multiple collections using MongoDB $regex (works without Atlas Search).
 * Falls back gracefully if text indexes are not available.
 */

/**
 * Search across all collections.
 * @param {string} query - Search term
 * @param {string} type - Filter by type: 'properties', 'users', 'rooms', or 'all'
 * @param {number} limit - Max results per collection
 * @returns {Object} Categorized results
 */
exports.globalSearch = async (query, type = 'all', limit = 10) => {
  if (!query || query.trim().length < 2) {
    return { properties: [], users: [], rooms: [], total: 0 };
  }

  const regex = new RegExp(query.trim(), 'i');
  const results = { properties: [], users: [], rooms: [], total: 0 };

  const searches = [];

  if (type === 'all' || type === 'properties') {
    searches.push(
      Property.find({
        $or: [
          { name: regex },
          { address: regex },
          { description: regex },
          { city: regex },
        ],
      })
        .select('name address city type images')
        .limit(limit)
        .lean()
        .then((data) => { results.properties = data; })
    );
  }

  if (type === 'all' || type === 'users') {
    searches.push(
      User.find({
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
        ],
      })
        .select('name email phone role profileImage kycStatus')
        .limit(limit)
        .lean()
        .then((data) => { results.users = data; })
    );
  }

  if (type === 'all' || type === 'rooms') {
    searches.push(
      Room.find({
        $or: [
          { roomNumber: regex },
          { description: regex },
        ],
      })
        .select('roomNumber floor type price status property')
        .populate('property', 'name')
        .limit(limit)
        .lean()
        .then((data) => { results.rooms = data; })
    );
  }

  await Promise.all(searches);

  results.total = results.properties.length + results.users.length + results.rooms.length;

  return results;
};
