const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    notes: { type: String },
});

module.exports = mongoose.model('Booking', bookingSchema);
