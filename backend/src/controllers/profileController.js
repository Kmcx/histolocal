const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");

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



const uploadIDImage = async (req, res) => {
  console.log("🔍 [uploadIDImage] İstek alındı");

  // Dosya kontrolü
  if (!req.file) {
    console.error("❌ [uploadIDImage] req.file yok – dosya alınamadı.");
    return res.status(400).json({ message: "No file provided" });
  }

  console.log("✅ [uploadIDImage] req.file bulundu:", {
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });

  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "id-verifications" },
      async (error, result) => {
        if (error) {
          console.error("❌ [uploadIDImage] Cloudinary upload hatası:", error);
          return res.status(500).json({ message: "Cloudinary upload failed", error });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
          console.error("❌ Kullanıcı bulunamadı:", req.user._id);
          return res.status(404).json({ message: "User not found" });
        }

        user.idImageUrl = result.secure_url;
        user.verificationStatus = "pending"; // opsiyonel
        await user.save();

        console.log("✅ [uploadIDImage] Upload ve kayıt başarılı:", result.secure_url);
        res.status(200).json({ message: "ID uploaded successfully", url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ [uploadIDImage] Genel hata:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  uploadIDImage,
};
  

module.exports = { getProfile, updateProfile, uploadIDImage };
