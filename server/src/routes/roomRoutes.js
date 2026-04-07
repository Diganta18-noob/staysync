const express = require('express');
const {
  getRooms, getRoom, createRoom, updateRoom, deleteRoom, lockRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/', getRooms);
router.post('/', protect, authorize('owner', 'admin'), createRoom);

// Individual room routes (not nested under property)
router.get('/:id', getRoom);
router.put('/:id', protect, authorize('owner', 'admin'), updateRoom);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteRoom);
router.post('/:id/lock', protect, lockRoom);

module.exports = router;
