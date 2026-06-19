const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getResultsBySport, getAllResults, createResult,
  updateResult, deleteResult, uploadResultPdf, removeResultPdf
} = require('../controllers/resultController');

// Public
router.get('/sport/:sportId', getResultsBySport);

// Admin (protected)
router.get('/', authMiddleware, getAllResults);
router.post('/', authMiddleware, createResult);
router.put('/:id', authMiddleware, updateResult);
router.delete('/:id', authMiddleware, deleteResult);
router.post('/:id/pdf', authMiddleware, upload.single('pdf'), uploadResultPdf);
router.delete('/:id/pdf', authMiddleware, removeResultPdf);

module.exports = router;