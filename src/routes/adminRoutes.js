const express = require('express');
const { verifyGuide } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-related APIs
 */

/**
 * @swagger
 * /api/admin/verify-guide:
 *   post:
 *     summary: Verify a guide
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guideId:
 *                 type: string
 *                 description: ID of the guide to verify
 *     responses:
 *       200:
 *         description: Guide verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide verified successfully
 *                 guide:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
// Rehber Doğrulama Rotası
router.post('/verify-guide', protect, verifyGuide);

module.exports = router;
