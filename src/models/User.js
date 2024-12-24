const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Visitor', 'Guide'], default: 'Visitor' },
    isVerified: { type: Boolean, default: false },
    guideDetails: {
        bio: { type: String, trim: true },
        languages: [{ type: String }], // Örneğin: "English", "Turkish"
        availability: { type: String }, // Örneğin: "Weekends Only"
    },
});

// Şifreyi hashleme
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
