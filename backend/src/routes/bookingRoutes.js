const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { updateBookingStatus } = require('../controllers/bookingController');

// create bookings
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
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
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', protect, createBooking);

// list users bookings
/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the current user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   guide:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                   notes:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', protect, getBookings);

// update bookings
/**
 * @swagger
 * /api/bookings/status:
 *   put:
 *     summary: Update the status of a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking to update
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Cancelled]
 *                 description: New status for the booking
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking status updated
 *                 booking:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.put('/status', protect, updateBookingStatus);

module.exports = router;
