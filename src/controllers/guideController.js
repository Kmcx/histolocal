const User = require('../models/User');

// Search guides
const searchGuides = async (req, res) => {
    const { location, expertise, languages, availability } = req.query;

    try {
        const query = { role: 'Guide' };

        if (location) query['guideDetails.location'] = location;
        if (expertise) query['guideDetails.expertise'] = expertise;
        if (languages) query['guideDetails.languages'] = { $in: languages.split(',') };
        if (availability) query['guideDetails.availability'] = availability;

        const guides = await User.find(query).select('-password');
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guides', error: error.message });
    }
};

// List all guides (returning full guide objects for frontend use)
const listGuides = async (req, res) => {
    try {
        const guides = await User.find({ role: 'Guide' }).select('-password');
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guides', error: error.message });
    }
};

module.exports = { searchGuides, listGuides };
