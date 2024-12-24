const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Kayıt ve Giriş Uç Noktaları
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
