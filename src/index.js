require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const profileRoutes = require('./routes/profileRoutes');
const db = require('./config/db');


// MongoDB Bağlantısı
(async () => {
    await db.connect();
})();
// Uygulama kapandığında bağlantıyı kapat
process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
});

// Middleware
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    res.send('Histolocal Backend API is running!');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Profile Routes
app.use('/api/profile', profileRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
