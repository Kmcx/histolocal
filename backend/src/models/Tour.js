const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Cancelled'], default: 'Pending' },
    notes: { type: String },
    completedAt: { type: Date },

});

module.exports = mongoose.model('Tour', tourSchema);