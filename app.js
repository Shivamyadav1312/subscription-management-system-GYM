const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const memberRoutes = require('./routes/members');
const subscriptionRoutes = require('./routes/subscriptions');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
require('dotenv').config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
