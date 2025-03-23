// routes/tourRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendTourRequest, acceptTour, completeTour, getTourRequests, rejectTourRequest,getTourDetails, getOngoingTours, getCompletedTours } = require('../controllers/tourController');

/**
 * @swagger
 * /api/tours/request:
 *   post:
 *     summary: Visitor sends a tour request to a guide
 *     tags: [Tours]
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
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tour request sent successfully
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.post('/request', protect, sendTourRequest);

/**
 * @swagger
 * /api/tours/accept:
 *   put:
 *     summary: Guide accepts a tour request and starts the tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tour started successfully
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Server error
 */
router.put('/accept', protect, acceptTour);

/**
 * @swagger
 * /api/tours/complete:
 *   put:
 *     summary: Complete the tour and record tour details
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tour completed and recorded
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Server error
 */
router.put('/complete', protect, completeTour);

router.get('/requests', protect, getTourRequests);

router.delete('/reject', protect, rejectTourRequest);

router.get('/ongoing', protect, getOngoingTours);

router.get('/completed', protect, getCompletedTours);

router.get('/:tourId', protect, getTourDetails);

module.exports = router;