const express = require('express');
const { globalSearch } = require('../services/searchService');
const { protect } = require('../middleware/auth');
const { cacheControl, generateETag } = require('../middleware/cacheMiddleware');

const router = express.Router();

// @desc    Global search
// @route   GET /api/search?q=<query>&type=<all|properties|users|rooms>
// @access  Private
router.get('/', protect, generateETag, cacheControl(30), async (req, res, next) => {
  try {
    const { q, type, limit } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const results = await globalSearch(q, type || 'all', parseInt(limit, 10) || 10);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
