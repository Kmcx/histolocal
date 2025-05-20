const express = require('express');
const { verifyUser, loginAdmin, getAllUsers, banUser, getPendingVerifications, rejectUser, unbanUser, unverifyUser } = require('../controllers/adminController');
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


//admin login
router.post('/login', loginAdmin);


// users
router.get('/users', protect, getAllUsers); // 🆕 Get all users
router.delete('/ban/:userId', protect, banUser);
router.post('/unban/:userId', protect, unbanUser);
router.post('/unverify/:userId', protect, unverifyUser);

//verification
router.get("/verification-requests", getPendingVerifications);
router.post("/verify-user", verifyUser);
router.post("/reject-user", protect, rejectUser);



module.exports = router;
