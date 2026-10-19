require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MongoDB URI is not defined in .env file. Skipping database connection for now.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.warn('The server will stay online, but booking data is unavailable until MongoDB is reachable.');
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
