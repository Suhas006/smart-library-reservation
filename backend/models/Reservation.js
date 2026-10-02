const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  durationHours: {
    type: Number,
    default: 2
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
