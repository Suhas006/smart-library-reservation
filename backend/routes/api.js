const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');
const Reservation = require('../models/Reservation');

// GET /seats: Fetches and returns all seats from the database.
router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.find({});
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Server error fetching seats' });
  }
});

// POST /book: Books a specific seat.
router.post('/book', async (req, res) => {
  try {
    const { seatId } = req.body;

    if (!seatId) {
      return res.status(400).json({ error: 'Seat ID is required in the request body.' });
    }

    const seat = await Seat.findOne({ seatId });

    if (!seat) {
      return res.status(400).json({ error: `Seat ${seatId} not found.` });
    }

    if (seat.status === 'booked') {
      return res.status(400).json({ error: 'Seat is already booked.' });
    }

    // Update seat status
    seat.status = 'booked';
    await seat.save();

    // Create a new reservation
    const newReservation = new Reservation({ seatId });
    await newReservation.save();

    res.status(200).json({ 
      message: 'Reservation successful!', 
      reservation: newReservation 
    });
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ error: 'Server error while booking seat' });
  }
});

// GET /reservations: Fetches all reservations, sorted by bookingTime descending
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ bookingTime: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
