const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logAudit } = require('../middleware/auditMiddleware');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'resident',
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: true });

    // Audit log
    req.user = user;
    await logAudit({
      req,
      action: 'USER_REGISTERED',
      targetUserId: user._id,
      targetUserName: user.name,
      resourceType: 'user',
      details: { email: user.email, role: 'resident' },
    });

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: true });

    // Audit log
    req.user = user;
    await logAudit({
      req,
      action: 'USER_LOGIN',
      targetUserId: user._id,
      targetUserName: user.name,
      resourceType: 'user',
      details: { email: user.email, role: user.role },
    });

    res.json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin email and password',
      });
    }

    // Find user and verify they are an admin
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: true });

    // Audit log
    req.user = user;
    await logAudit({
      req,
      action: 'ADMIN_LOGIN',
      targetUserId: user._id,
      targetUserName: user.name,
      resourceType: 'system',
      details: { email: user.email, loginTime: new Date().toISOString() },
    });

    res.json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('currentRoom');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateModifiedOnly: true });

    res.json({ success: true, data: tokens });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'aadharNumber', 'profileImage'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.kycStatus) filter.kycStatus = req.query.kycStatus;

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'owner', 'resident'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save({ validateModifiedOnly: true });

    // Audit log
    await logAudit({
      req,
      action: 'ROLE_CHANGED',
      targetUserId: targetUser._id,
      targetUserName: targetUser.name,
      resourceType: 'user',
      details: { previousRole, newRole: role, email: targetUser.email },
    });

    res.json({ success: true, data: targetUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Update KYC status (Admin/Owner)
// @route   PUT /api/auth/users/:id/kyc
// @access  Private/Admin,Owner
const updateKycStatus = async (req, res, next) => {
  try {
    const { kycStatus } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(kycStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const previousStatus = targetUser.kycStatus;
    targetUser.kycStatus = kycStatus;
    await targetUser.save({ validateModifiedOnly: true });

    const action = kycStatus === 'verified' ? 'KYC_APPROVED' : 'KYC_REJECTED';
    await logAudit({
      req,
      action,
      targetUserId: targetUser._id,
      targetUserName: targetUser.name,
      resourceType: 'user',
      details: { previousStatus, newStatus: kycStatus, email: targetUser.email },
    });

    res.json({ success: true, data: targetUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  refreshAccessToken,
  updateProfile,
  getAllUsers,
  updateUserRole,
  updateKycStatus,
};
