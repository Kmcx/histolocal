const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Kullanıcı Profili Gösterme
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Şifre hariç tüm bilgileri döndür
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};


// Kullanıcı Profilini Güncelleme
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Kullanıcı bilgilerini güncelle
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Şifreyi güncelle
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        // Eğer kullanıcı bir rehberse, özel rehber alanlarını güncelle
        if (user.role === 'Guide' && req.body.guideDetails) {
            user.guideDetails = {
                bio: req.body.guideDetails.bio || user.guideDetails?.bio,
                languages: req.body.guideDetails.languages || user.guideDetails?.languages,
                availability: req.body.guideDetails.availability || user.guideDetails?.availability,
            };
        }

        const updatedUser = await user.save();

        // Güncellenmiş bilgileri döndür
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            guideDetails: updatedUser.guideDetails, // Rehber bilgilerini döndür
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


module.exports = { getProfile, updateProfile };




