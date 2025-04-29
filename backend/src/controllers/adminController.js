const User = require('../models/User');

// Rehber Doğrulama
const verifyGuide = async (req, res) => {
    const { guideId } = req.body;

    try {
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'Guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        guide.isVerified = true;
        await guide.save();

        res.status(200).json({ message: 'Guide verified successfully', guide });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying guide', error: error.message });
    }
};

module.exports = { verifyGuide };
