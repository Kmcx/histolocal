require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const mongoose = require('mongoose');
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const guideRoutes = require('./routes/guideRoutes');
const tourRoutes = require('./routes/tourRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cloudinaryRoutes = require("./routes/cloudinaryRoutes"); 

const cors = require('cors');

// CORS 

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    // Tarayıcılar origin göndermeyebilir (örneğin Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: No access for origin ${origin}`));
    }
  },
  credentials: true,
}));


// MongoDB connection
(async () => {
    await db.connect();
})();
// close connection when app terminated
process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('Swagger docs available at http://localhost:5000/api-docs');

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

//Guide Routes
app.use('/api/guides', guideRoutes);

//Booking Routes
app.use('/api/tours', tourRoutes);

//Admin Routes
app.use('/api/admin', adminRoutes);

//Feedback Route
app.use('/api/feedback', feedbackRoutes);

//Cloudinary Route
app.use("/api/cloudinary", cloudinaryRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
