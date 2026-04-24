const Permission = require('../models/Permission');

/**
 * Default permission matrix.
 * Seeded on first boot if no permissions exist.
 */
const defaultPermissions = [
  // Admin — full access (handled by bypass, but define for reference)
  { role: 'admin', resource: 'properties', actions: ['manage'] },
  { role: 'admin', resource: 'rooms', actions: ['manage'] },
  { role: 'admin', resource: 'bookings', actions: ['manage'] },
  { role: 'admin', resource: 'payments', actions: ['manage'] },
  { role: 'admin', resource: 'users', actions: ['manage'] },
  { role: 'admin', resource: 'audit', actions: ['read', 'export'] },
  { role: 'admin', resource: 'tickets', actions: ['manage'] },
  { role: 'admin', resource: 'dashboard', actions: ['read'] },

  // Owner — manage own properties, rooms, bookings, payments
  { role: 'owner', resource: 'properties', actions: ['create', 'read', 'update', 'delete'], conditions: { ownOnly: true } },
  { role: 'owner', resource: 'rooms', actions: ['create', 'read', 'update', 'delete'], conditions: { ownOnly: true } },
  { role: 'owner', resource: 'bookings', actions: ['read', 'update'], conditions: { ownOnly: true } },
  { role: 'owner', resource: 'payments', actions: ['create', 'read', 'update'], conditions: { ownOnly: true } },
  { role: 'owner', resource: 'users', actions: ['read'] },
  { role: 'owner', resource: 'tickets', actions: ['read', 'update'], conditions: { ownOnly: true } },
  { role: 'owner', resource: 'dashboard', actions: ['read'] },

  // Resident — limited access
  { role: 'resident', resource: 'properties', actions: ['read'] },
  { role: 'resident', resource: 'rooms', actions: ['read'] },
  { role: 'resident', resource: 'bookings', actions: ['create', 'read'], conditions: { ownOnly: true } },
  { role: 'resident', resource: 'payments', actions: ['read'], conditions: { ownOnly: true } },
  { role: 'resident', resource: 'tickets', actions: ['create', 'read'], conditions: { ownOnly: true } },
  { role: 'resident', resource: 'dashboard', actions: ['read'] },
];

const seedPermissions = async () => {
  try {
    const count = await Permission.countDocuments();
    if (count > 0) {
      return; // Already seeded
    }

    await Permission.insertMany(defaultPermissions);
    console.log(`[Seed] ${defaultPermissions.length} default permissions created`);
  } catch (error) {
    console.error('[Seed] Error seeding permissions:', error.message);
  }
};

module.exports = seedPermissions;
