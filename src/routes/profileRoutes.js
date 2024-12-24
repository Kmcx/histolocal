const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Profil Görüntüleme
router.get('/', protect, getProfile);

// Profil Güncelleme
router.put('/', protect, updateProfile);

module.exports = router;
