const express = require('express');
const {
  register, login, adminLogin, getMe, refreshAccessToken,
  updateProfile, getAllUsers, updateUserRole, updateKycStatus,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/users/:id/kyc', protect, authorize('admin', 'owner'), updateKycStatus);

module.exports = router;
