const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Visitor', 'Guide'], default: 'Visitor' },
    isVerified: { type: Boolean, default: false },
    bio: { type: String, trim: true, default: "" },
    languages: [{ type: String, default: [] }],
    guideDetails: {
        availability: { type: Boolean, default: true },
        location: { type: String, trim: true, default: "" }, // Added for future use
    },
});


//  Hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
