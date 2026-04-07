const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@staysync.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // Ensure the user has admin role
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save({ validateModifiedOnly: true });
        console.log(`[Seed] Upgraded ${adminEmail} to admin role`);
      } else {
        console.log(`[Seed] Admin user already exists: ${adminEmail}`);
      }
      return;
    }

    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      phone: '0000000000',
      role: 'admin',
      kycStatus: 'verified',
    });

    console.log(`[Seed] Admin user created: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.error('[Seed] Failed to seed admin user:', err.message);
  }
};

module.exports = seedAdmin;
