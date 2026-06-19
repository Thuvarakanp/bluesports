const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  sport_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true
  },
  gold_winner: { type: String, default: '' },
  silver_winner: { type: String, default: '' },
  bronze_winner: { type: String, default: '' },
  pdf_path: { type: String, default: '' },        // URL (Cloudinary) or /uploads path (disk)
  pdf_public_id: { type: String, default: '' }    // Cloudinary public_id, used for deletion
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);