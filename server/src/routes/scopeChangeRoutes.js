const express = require('express');
const {
  getScopeChanges, getScopeChange, createScopeChange,
  reviewScopeChange, implementScopeChange,
} = require('../controllers/scopeChangeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getScopeChanges);
router.get('/:id', getScopeChange);
router.post('/', createScopeChange);
router.put('/:id/review', authorize('admin'), reviewScopeChange);
router.put('/:id/implement', authorize('admin'), implementScopeChange);

module.exports = router;
