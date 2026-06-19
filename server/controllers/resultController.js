const path = require('path');
const fs = require('fs');
const Result = require('../models/Result');
const { isConnected } = require('../config/db');
const { isCloudinaryConfigured, uploadPdfBuffer, destroyPdf } = require('../config/cloudinary');

const uploadDir = path.join(__dirname, '../uploads');

// Remove the stored PDF from wherever it lives (Cloudinary or local disk).
const deleteStoredPdf = async (result) => {
  if (!result) return;
  if (result.pdf_public_id) {
    try {
      await destroyPdf(result.pdf_public_id);
    } catch (error) {
      console.error('Failed to delete Cloudinary PDF:', error.message);
    }
    return;
  }
  if (result.pdf_path && result.pdf_path.startsWith('/uploads/')) {
    const filePath = path.join(uploadDir, path.basename(result.pdf_path));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

const serializeResult = (doc) => ({
  id: doc._id.toString(),
  sport_id: doc.sport_id.toString(),
  gold_winner: doc.gold_winner,
  silver_winner: doc.silver_winner,
  bronze_winner: doc.bronze_winner,
  pdf_path: doc.pdf_path || ''
});

const getResultsBySport = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { sportId } = req.params;
    const results = await Result.find({ sport_id: sportId })
      .populate({ path: 'sport_id', select: 'name gender age_category_id', populate: { path: 'age_category_id', select: 'name' } })
      .sort({ createdAt: 1 });

    const formatted = results.map((result) => ({
      ...serializeResult(result),
      sport_name: result.sport_id?.name || '',
      gender: result.sport_id?.gender || '',
      age_category_name: result.sport_id?.age_category_id?.name || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllResults = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const results = await Result.find()
      .populate({ path: 'sport_id', select: 'name gender age_category_id', populate: { path: 'age_category_id', select: 'name' } })
      .sort({ createdAt: 1 });

    const formatted = results.map((result) => ({
      ...serializeResult(result),
      sport_name: result.sport_id?.name || '',
      gender: result.sport_id?.gender || '',
      age_category_name: result.sport_id?.age_category_id?.name || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
    const result = await Result.create({ sport_id, gold_winner, silver_winner, bronze_winner });
    res.status(201).json(serializeResult(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
    await Result.findByIdAndUpdate(id, { sport_id, gold_winner, silver_winner, bronze_winner }, { new: true });
    res.json({ message: 'Result updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const result = await Result.findById(id);
    await deleteStoredPdf(result);
    await Result.findByIdAndDelete(id);
    res.json({ message: 'Result deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadResultPdf = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    if (!req.file) return res.status(400).json({ message: 'No PDF file uploaded' });

    const { id } = req.params;
    const result = await Result.findById(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    // Delete old PDF (Cloudinary or disk) before storing the new one.
    await deleteStoredPdf(result);

    let pdfUrl;
    let pdfPublicId = '';

    if (isCloudinaryConfigured()) {
      const uploaded = await uploadPdfBuffer(req.file.buffer, req.file.originalname);
      pdfUrl = uploaded.secure_url;
      pdfPublicId = uploaded.public_id;
    } else {
      // Local-disk fallback (development only — not durable on cloud hosts).
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${unique}${path.extname(req.file.originalname)}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      pdfUrl = `/uploads/${filename}`;
    }

    await Result.findByIdAndUpdate(id, { pdf_path: pdfUrl, pdf_public_id: pdfPublicId });
    res.json({ message: 'PDF uploaded successfully', pdf_path: pdfUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeResultPdf = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const result = await Result.findById(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    await deleteStoredPdf(result);
    await Result.findByIdAndUpdate(id, { pdf_path: '', pdf_public_id: '' });
    res.json({ message: 'PDF removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getResultsBySport, getAllResults, createResult, updateResult, deleteResult, uploadResultPdf, removeResultPdf };