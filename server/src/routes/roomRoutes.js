const express = require('express');
const {
  getRooms, getRoom, createRoom, updateRoom, deleteRoom, lockRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');
const { cacheControl, generateETag, clearCache } = require('../middleware/cacheMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', generateETag, cacheControl(300), getRooms);
router.post('/', protect, authorize('owner', 'admin'), clearCache, createRoom);

// Individual room routes (not nested under property)
router.get('/:id', generateETag, cacheControl(300), getRoom);
router.put('/:id', protect, authorize('owner', 'admin'), clearCache, updateRoom);
router.delete('/:id', protect, authorize('owner', 'admin'), clearCache, deleteRoom);
router.post('/:id/lock', protect, clearCache, lockRoom);

module.exports = router;
