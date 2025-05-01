const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/jwt');

// Kullanıcı Kaydı
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log("Received data:", req.body); // ✅ Debugging log

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.error("Email already exists:", email);
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error during registration:", error); // ✅ Print full error
        res.status(500).json({ message: "Error occurred", error: error.message });
    }
};

// Kullanıcı Girişi
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    console.log("Received data:", req.body); // ✅ Debugging log

    try {
        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Şifreyi doğrula
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Error during login:', error); // Hata detaylarını konsola yazdır
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
};


module.exports = { registerUser, loginUser };
