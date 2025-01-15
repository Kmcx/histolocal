const Feedback = require('../models/Feedback');

// Geri Bildirim Oluşturma
const createFeedback = async (req, res) => {
    const { guideId, rating, comment } = req.body;

    try {
        const feedback = await Feedback.create({
            user: req.user._id,
            guide: guideId,
            rating,
            comment,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Rehber için Tüm Geri Bildirimleri Getir
const getGuideFeedback = async (req, res) => {
    const { guideId } = req.params;

    try {
        const feedbacks = await Feedback.find({ guide: guideId }).populate('user', 'name');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

module.exports = { createFeedback, getGuideFeedback };
