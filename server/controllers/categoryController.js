const AgeCategory = require('../models/AgeCategory');
const Sport = require('../models/Sport');
const Result = require('../models/Result');
const { isConnected } = require('../config/db');

const serializeAgeCategory = (doc) => ({
  id: doc._id.toString(),
  name: doc.name
});

const serializeSport = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  age_category_id: doc.age_category_id.toString(),
  gender: doc.gender
});

const getAgeCategories = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const categories = await AgeCategory.find().sort({ createdAt: 1 });
    res.json(categories.map(serializeAgeCategory));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSports = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { ageCategoryId, gender } = req.params;
    const sports = await Sport.find({
      age_category_id: ageCategoryId,
      gender
    }).sort({ name: 1 });

    res.json(sports.map(serializeSport));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAgeCategory = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { name } = req.body;
    const category = await AgeCategory.create({ name });
    res.status(201).json(serializeAgeCategory(category));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAgeCategory = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { id } = req.params;
    const { name } = req.body;

    await AgeCategory.findByIdAndUpdate(id, { name }, { new: true });
    res.json({ message: 'Age category updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAgeCategory = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { id } = req.params;
    const relatedSports = await Sport.find({ age_category_id: id });

    for (const sport of relatedSports) {
      await Result.deleteMany({ sport_id: sport._id });
    }

    await Sport.deleteMany({ age_category_id: id });
    await AgeCategory.findByIdAndDelete(id);

    res.json({ message: 'Age category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSport = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { name, age_category_id, gender } = req.body;
    const sport = await Sport.create({ name, age_category_id, gender });
    res.status(201).json(serializeSport(sport));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSport = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { id } = req.params;
    const { name, age_category_id, gender } = req.body;

    await Sport.findByIdAndUpdate(id, { name, age_category_id, gender }, { new: true });
    res.json({ message: 'Sport updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSport = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { id } = req.params;
    await Result.deleteMany({ sport_id: id });
    await Sport.findByIdAndDelete(id);
    res.json({ message: 'Sport deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllSports = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const sports = await Sport.find()
      .populate('age_category_id', 'name')
      .sort({ createdAt: 1 });

    const formatted = sports.map((sport) => ({
      id: sport._id.toString(),
      name: sport.name,
      age_category_id: sport.age_category_id?._id?.toString?.() || sport.age_category_id,
      age_category_name: sport.age_category_id?.name || '',
      gender: sport.gender
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAgeCategories,
  getSports,
  createAgeCategory,
  updateAgeCategory,
  deleteAgeCategory,
  createSport,
  updateSport,
  deleteSport,
  getAllSports
};
