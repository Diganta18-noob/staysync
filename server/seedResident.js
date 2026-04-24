const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/staysync')
  .then(async () => {
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const hash = await bcrypt.hash('password123', 10);
    
    await users.updateOne(
      { email: 'resident@staysync.com' },
      {
        $set: {
          name: 'Test Resident',
          email: 'resident@staysync.com',
          password: hash,
          phone: '9876543210',
          role: 'resident',
          kycStatus: 'verified',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('Resident seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
