require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const formsRoutes = require('./routes/forms');
const { authenticateJWT } = require('./middleware/auth');
const privacyRoutes = require('./routes/privacySettings');
const profileRoutes = require('./routes/profile');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Initialize middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', authenticateJWT, formsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/profile', profileRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Form Dashboard API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
