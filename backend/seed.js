require('dotenv').config();
const mongoose = require('mongoose');
const Seat = require('./models/Seat');
const Reservation = require('./models/Reservation');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding.');

    try {
      // Clear existing seats
      await Seat.deleteMany({});
      console.log('Existing seats cleared.');

      // Clear existing reservations (optional, but good for resetting state)
      await Reservation.deleteMany({});
      
      // Generate 24 default seats
      const seatsToInsert = [];
      for (let i = 1; i <= 24; i++) {
        seatsToInsert.push({
          seatId: `Seat-${i}`,
          status: 'available'
        });
      }

      await Seat.insertMany(seatsToInsert);
      console.log('Successfully inserted 24 default seats.');

      process.exit(0);
    } catch (error) {
      console.error('Error during seeding:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
