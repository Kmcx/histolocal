const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Profil Görüntüleme
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getProfile);

// update profile
/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               guideDetails:
 *                 type: object
 *                 properties:
 *                   bio:
 *                     type: string
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *                   availability:
 *                     type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/', protect, updateProfile);

module.exports = router;
