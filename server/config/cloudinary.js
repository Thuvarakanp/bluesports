const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

// Cloudinary is only used when all three credentials are present. If they are
// missing (e.g. local dev without an account) the app falls back to local disk
// storage — see controllers/resultController.js.
const isCloudinaryConfigured = () =>
  Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });
}

// Upload a PDF buffer to Cloudinary as a "raw" file so it is served back with
// the correct content type and can be viewed/downloaded directly.
const uploadPdfBuffer = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'sports_meet/results',
        public_id: `${Date.now()}-${safeName}`
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

const destroyPdf = (publicId) =>
  cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

module.exports = { cloudinary, isCloudinaryConfigured, uploadPdfBuffer, destroyPdf };
