const multer = require('multer');

// Keep the file in memory; the controller streams it to Cloudinary in
// production, or writes it to local disk as a fallback during development.
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });
