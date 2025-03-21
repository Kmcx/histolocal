const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile by userId
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update user profile by userId with proper type checks
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.languages = req.body.languages || user.languages;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.guideDetails) {
            if (typeof req.body.guideDetails.availability === 'boolean') {
                user.guideDetails.availability = req.body.guideDetails.availability;
            }
            if (req.body.guideDetails.location) {
                user.guideDetails.location = req.body.guideDetails.location;
            }
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

module.exports = { getProfile, updateProfile };
