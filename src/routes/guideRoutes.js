const express = require('express');
const { searchGuides } = require('../controllers/guideController');
const router = express.Router();

// search guide route
/**
 * @swagger
 * /api/guides/search:
 *   get:
 *     summary: Search for guides based on filters
 *     tags: [Guides]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location of the guide
 *       - in: query
 *         name: expertise
 *         schema:
 *           type: string
 *         description: Expertise of the guide
 *       - in: query
 *         name: languages
 *         schema:
 *           type: string
 *         description: Comma-separated list of languages
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *         description: Guide availability
 *     responses:
 *       200:
 *         description: List of guides matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   guideDetails:
 *                     type: object
 *                     properties:
 *                       bio:
 *                         type: string
 *                       languages:
 *                         type: array
 *                         items:
 *                           type: string
 *                       availability:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/search', searchGuides);

module.exports = router;
