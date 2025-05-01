const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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
  
      res.status(200).json({ token, isAdmin: true });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

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
  

module.exports = { verifyGuide, loginAdmin, banUser , getAllUsers};
