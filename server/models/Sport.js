const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgeCategory',
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sport', sportSchema);
