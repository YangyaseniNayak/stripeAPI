const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const stripeRoutes = require('./routers/stripeRoute');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: "*",  // Allow requests from any origin
  credentials: true,
  optionSuccessStatus: 200,
}));

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use stripe routes
app.use('/api/stripe', stripeRoutes); // Mount the router

// Connect to MongoDB
const MongoURL = process.env.MONGO_URL;
if (!MongoURL) {
  console.error('MONGO_URL is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);  // Exit if MongoDB connection fails
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
