require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const mongoose = require('mongoose');
const db = require('./config/db');
const logger = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const guideRoutes = require('./routes/guideRoutes');
const tourRoutes = require('./routes/tourRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8081', 'http://localhost:8082'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

// Performance Middleware
app.use(compression());

// Logging Middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// MongoDB connection
(async () => {
    try {
        await db.connect();
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
})();

// close connection when app terminated
process.on('SIGINT', async () => {
    try {
        await db.disconnect();
        logger.info('MongoDB disconnected successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error during MongoDB disconnection:', error);
        process.exit(1);
    }
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
logger.info('Swagger docs available at http://localhost:5000/api-docs');

// Middleware
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Histolocal Backend API is running!',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
