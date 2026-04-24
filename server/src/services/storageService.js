/**
 * Storage Service — Abstraction layer for file uploads.
 * Supports: Cloudinary (default), S3, Azure Blob.
 * Provider is selected via STORAGE_PROVIDER env var.
 */
const cloudinary = require('cloudinary').v2;

const provider = process.env.STORAGE_PROVIDER || 'cloudinary';

/**
 * Upload a file.
 * @param {Buffer|string} file - File buffer or local path
 * @param {Object} options - { folder, publicId, resourceType }
 * @returns {Object} { url, publicId, provider }
 */
const upload = async (file, options = {}) => {
  switch (provider) {
    case 'cloudinary':
      return uploadCloudinary(file, options);
    case 's3':
      return uploadS3(file, options);
    case 'azure':
      return uploadAzure(file, options);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
};

/**
 * Delete a file.
 * @param {string} publicId - File identifier
 * @returns {Object} { deleted: boolean }
 */
const deleteFile = async (publicId) => {
  switch (provider) {
    case 'cloudinary':
      return deleteCloudinary(publicId);
    case 's3':
      return deleteS3(publicId);
    case 'azure':
      return deleteAzure(publicId);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
};

/**
 * Get a signed/public URL for a file.
 * @param {string} publicId - File identifier
 * @param {number} expiresIn - Seconds until expiry (for S3/Azure)
 * @returns {string} URL
 */
const getUrl = async (publicId, expiresIn = 3600) => {
  switch (provider) {
    case 'cloudinary':
      return cloudinary.url(publicId, { secure: true });
    case 's3':
      return getS3SignedUrl(publicId, expiresIn);
    case 'azure':
      return getAzureUrl(publicId, expiresIn);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
};

// ─── Cloudinary ──────────────────────────────────────────
async function uploadCloudinary(file, options) {
  const uploadOptions = {
    folder: options.folder || 'staysync',
    resource_type: options.resourceType || 'auto',
  };
  if (options.publicId) uploadOptions.public_id = options.publicId;

  const result = typeof file === 'string'
    ? await cloudinary.uploader.upload(file, uploadOptions)
    : await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        stream.end(file);
      });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    provider: 'cloudinary',
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

async function deleteCloudinary(publicId) {
  const result = await cloudinary.uploader.destroy(publicId);
  return { deleted: result.result === 'ok' };
}

// ─── S3 (Stub) ──────────────────────────────────────────
async function uploadS3(file, options) {
  // To be implemented when AWS SDK is added
  throw new Error('S3 upload not yet configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, S3_REGION in .env');
}

async function deleteS3(publicId) {
  throw new Error('S3 delete not yet configured.');
}

async function getS3SignedUrl(publicId, expiresIn) {
  throw new Error('S3 signed URL not yet configured.');
}

// ─── Azure Blob (Stub) ──────────────────────────────────
async function uploadAzure(file, options) {
  throw new Error('Azure Blob upload not yet configured. Set AZURE_STORAGE_CONNECTION_STRING in .env');
}

async function deleteAzure(publicId) {
  throw new Error('Azure Blob delete not yet configured.');
}

async function getAzureUrl(publicId, expiresIn) {
  throw new Error('Azure Blob URL not yet configured.');
}

module.exports = { upload, deleteFile, getUrl, provider };
