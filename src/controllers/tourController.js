const Tour = require('../models/Tour');
const User = require('../models/User');

// Visitor sends a tour request
const sendTourRequest = async (req, res) => {
    try {
      const newTour = new Tour({
        visitor: req.user._id,
        guide: req.body.guideId,
        status: 'Pending',
      });
      await newTour.save();
      res.status(201).json({ message: 'Tour request sent.' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending tour request', error: error.message });
    }
  };

// Guide accepts the tour
const acceptTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.body.tourId);
      if (!tour) return res.status(404).json({ message: 'Tour not found' });
  
      tour.status = 'Active';
      tour.startDate = new Date();
  
      await tour.save();
      res.status(200).json({ message: 'Tour started successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error accepting tour', error: error.message });
    }
  };

  const rejectTourRequest = async (req, res) => {
    try {
      const tour = await Tour.findById(req.body.tourId);
      if (!tour) return res.status(404).json({ message: 'Tour request not found' });
  
      await Tour.findByIdAndDelete(req.body.tourId);
      res.status(200).json({ message: 'Tour request rejected and deleted.' });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting tour request', error: error.message });
    }
  };
  

// Complete the tour and record details
const completeTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.body.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    tour.status = 'Completed';
    tour.completedAt = new Date();   // ✅ Bitiş tarihi kaydet
    await tour.save();

    res.status(200).json({ message: 'Tour completed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing tour', error: error.message });
  }
};


// Guide gets incoming tour requests
const getTourRequests = async (req, res) => {
    try {
      const requests = await Tour.find({ guide: req.user._id, status: 'Pending' })
        .populate('visitor', 'name email');
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tour requests', error: error.message });
    }
  };

  const getTourDetails = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.tourId)
        .populate('visitor', 'name email')
        .populate('guide', 'name email');
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tour details', error: error.message });
    }
  };

  const getOngoingTours = async (req, res) => {
    

    try {
      const tours = await Tour.find({
        status: 'Active',
        $or: [{ visitor: req.user._id }, { guide: req.user._id }],
      })
        .populate('visitor', 'name email')
        .populate('guide', 'name email');
  
      res.status(200).json(tours);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ongoing tours', error: error.message });
    }
  };

  const getCompletedTours = async (req, res) => {
    try {
      const completedTours = await Tour.find({
        status: 'Completed',
        $or: [{ visitor: req.user._id }, { guide: req.user._id }],
      })
        .populate('visitor', 'name email')
        .populate('guide', 'name email');
  
      res.status(200).json(completedTours);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching completed tours', error: error.message });
    }
  };
  
  
  

module.exports = { sendTourRequest, 
    acceptTour, 
    completeTour,
    getTourRequests,
    rejectTourRequest,
    getTourDetails,
    getOngoingTours,
    getCompletedTours };