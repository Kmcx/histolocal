const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },  // ✅ eklenecek alan
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
}, { timestamps: true });


module.exports = mongoose.model('Feedback', feedbackSchema);
