const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available'
  }
});

module.exports = mongoose.model('Seat', seatSchema);
