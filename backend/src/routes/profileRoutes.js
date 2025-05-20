const express = require('express');
const { getProfile, updateProfile, uploadIDImage } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require("../config/multer");



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
router.get('/:userId', protect, getProfile);

// update profile
/**
 * @swagger
 * /api/profile/{userId}:
 *   put:
 *     summary: Update user profile by user ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
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
 *                   location:
 *                     type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/edit/:userId', updateProfile);

router.post("/upload-id", protect, upload.single("file"), uploadIDImage);


module.exports = router;
