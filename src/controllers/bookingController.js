const Booking = require('../models/Booking');
const User = require('../models/User');

// Rezervasyon Oluşturma
const createBooking = async (req, res) => {
    const { guideId, date, notes } = req.body;

    try {
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'Guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const booking = await Booking.create({
            visitor: req.user._id,
            guide: guideId,
            date,
            notes,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// Kullanıcının Rezervasyonlarını Listeleme
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ visitor: req.user._id }).populate('guide', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Rezervasyon Durumunu Güncelleme
const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await booking.save();

        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
