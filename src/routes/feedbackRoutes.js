const express = require('express');
const { createFeedback, getGuideFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// create feedbacks
/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback for a guide
 *     tags: [Feedback]
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', protect, createFeedback);

// get feedbacks for guide
/**
 * @swagger
 * /api/feedback/{guideId}:
 *   get:
 *     summary: Get feedback for a specific guide
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the guide
 *     responses:
 *       200:
 *         description: List of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.get('/:guideId', getGuideFeedback);

module.exports = router;
