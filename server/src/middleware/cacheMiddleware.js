const crypto = require('crypto');

/**
 * Cache-Control & CDN Caching Middleware
 * Implement basic HTTP caching, ETag, and CDN directives
 */

// Basic Cache-Control helper for static/public data
exports.cacheControl = (seconds = 300, isPublic = true) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    const directive = isPublic ? 'public' : 'private';
    res.setHeader('Cache-Control', `${directive}, max-age=${seconds}`);
    next();
  };
};

// CDN Edge caching helper (s-maxage overrides max-age for CDNs)
exports.cdnCache = (edgeSeconds = 600, browserSeconds = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    // Instructs CDN (e.g. Cloudflare) to cache for edgeSeconds, and browser for browserSeconds
    res.setHeader('Cache-Control', `public, max-age=${browserSeconds}, s-maxage=${edgeSeconds}`);
    next();
  };
};

// Cache Invalidators - Clears caching for subsequent requests
// Usually attached to PUT/POST/DELETE routes
exports.clearCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

/**
 * Manual ETag generation middleware
 * (Express does this automatically for res.send, but manual control is sometimes needed)
 */
exports.generateETag = (req, res, next) => {
  // Save original send
  const originalSend = res.send;

  res.send = function (body) {
    // Only generate ETag for GET requests that return JSON
    if (req.method === 'GET' && typeof body === 'string') {
      const hash = crypto.createHash('md5').update(body).digest('hex');
      const etag = `W/"${hash}"`;

      res.setHeader('ETag', etag);

      // Check if client sent matching If-None-Match
      if (req.headers['if-none-match'] === etag) {
        res.status(304);
        return originalSend.call(this, ''); // Empty body for 304 Not Modified
      }
    }
    originalSend.call(this, body);
  };
  next();
};
