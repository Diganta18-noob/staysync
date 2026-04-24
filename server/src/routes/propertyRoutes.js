const express = require('express');
const {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, getMyProperties,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { cacheControl, generateETag, clearCache } = require('../middleware/cacheMiddleware');
const roomRoutes = require('./roomRoutes');

const router = express.Router();

// Re-route into room routes
router.use('/:propertyId/rooms', roomRoutes);

router.get('/', generateETag, cacheControl(300), getProperties);
router.get('/my', protect, authorize('owner', 'admin'), getMyProperties);
router.get('/:id', generateETag, cacheControl(300), getProperty);
router.post('/', protect, authorize('owner', 'admin'), clearCache, createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), clearCache, updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), clearCache, deleteProperty);

module.exports = router;
