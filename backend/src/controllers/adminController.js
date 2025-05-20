const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
      res.status(200).json({
      token,
      isAdmin: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  // 
const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isVerified: false,
      idImageUrl: { $ne: "" },
    }).select("name email idImageUrl role");

    res.status(200).json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: "Error loading verifications", error: err.message });
  }
};

// Verify user
const verifyUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tip kontrolü: availability boş string gelirse düzelt
    if (
      user?.guideDetails &&
      typeof user.guideDetails.availability === "string" &&
      user.guideDetails.availability.trim() === ""
    ) {
      console.log("ℹ️ guideDetails.availability boş string → false yapıldı");
      user.guideDetails.availability = false;
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "User verified" });
  } catch (err) {
    console.error("❌ Verification failed:", err);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};




// Reject user's ID image
const rejectUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || !user.idImageUrl) {
      return res.status(404).json({ message: "User or ID image not found" });
    }

    const publicId = user.idImageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`id-verifications/${publicId}`);

    user.idImageUrl = "";
    user.verificationStatus = "rejected";
    await user.save();

    res.status(200).json({ message: "User ID image rejected and removed" });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Reject failed", error: error.message });
  }
};


// List all users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };

  const banUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.banned = true;
      await user.save();
  
      res.status(200).json({ message: 'User has been banned' });
    } catch (error) {
      res.status(500).json({ message: 'Error banning user', error: error.message });
    }
  };

  const unbanUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.banned = false;
    await user.save();

    res.status(200).json({ message: 'User has been unbanned' });
  } catch (error) {
    res.status(500).json({ message: 'Error unbanning user', error: error.message });
  }
};

const unverifyUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = false;
    await user.save();

    res.status(200).json({ message: 'User verification removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error unverifying user', error: error.message });
  }
};

  

module.exports = { verifyUser, loginAdmin, banUser , 
  getAllUsers, getPendingVerifications, rejectUser,
  unbanUser, unverifyUser };
