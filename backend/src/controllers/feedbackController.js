const Feedback = require('../models/Feedback');

// Geri Bildirim Oluşturma
const createFeedback = async (req, res) => {
    const { toUser, rating, comment, tourId } = req.body;
    try {
      const feedback = await Feedback.create({
        fromUser: req.user._id,
        toUser,
        rating,
        comment,
        tourId,   // ✅ turId kaydı
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

const getUserFeedback = async (req, res) => {
    const { userId } = req.params;
    try {
      const feedbacks = await Feedback.find({ toUser: userId }).populate('fromUser', 'name');
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  };

  const getFeedbackForTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.tourId);
      if (!tour) return res.status(404).json({ message: 'Tour not found' });
  
      const currentUserId = req.user._id;
      const targetUserId = tour.visitor.equals(currentUserId) ? tour.guide : tour.visitor;
  
      const feedback = await Feedback.findOne({
        fromUser: currentUserId,
        toUser: targetUserId,
      });
  
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  };
  const getFeedbacksByTour = async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ tourId: req.params.tourId }).populate('fromUser', 'name');
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
    }
  };

  // Ortalama puanı hesapla
const getGuideAverageRating = async (req, res) => {
  const { guideId } = req.params;

  try {
    const feedbacks = await Feedback.find({ toUser: guideId });

    if (feedbacks.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }

    const total = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const average = total / feedbacks.length;

    res.status(200).json({ averageRating: average.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average rating', error: error.message });
  }
};

  
  
  

module.exports = { createFeedback, 
    getGuideFeedback, 
    getUserFeedback,
    getFeedbackForTour,
    getFeedbacksByTour,
  getGuideAverageRating };
 