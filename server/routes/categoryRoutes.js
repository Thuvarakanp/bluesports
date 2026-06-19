const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAgeCategories,
    getSports,
    createAgeCategory,
    updateAgeCategory,
    deleteAgeCategory,
    createSport,
    updateSport,
    deleteSport,
    getAllSports
} = require('../controllers/categoryController');

// Public routes
router.get('/age', getAgeCategories);
router.get('/sports/:ageCategoryId/:gender', getSports);

// Admin routes (protected)
router.get('/sports', authMiddleware, getAllSports);
router.post('/age', authMiddleware, createAgeCategory);
router.put('/age/:id', authMiddleware, updateAgeCategory);
router.delete('/age/:id', authMiddleware, deleteAgeCategory);
router.post('/sports', authMiddleware, createSport);
router.put('/sports/:id', authMiddleware, updateSport);
router.delete('/sports/:id', authMiddleware, deleteSport);

module.exports = router;
