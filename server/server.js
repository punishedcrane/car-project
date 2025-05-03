// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stripeCheckoutRoute from './routes/stripeRoutes.js';     // Renamed for clarity
import stripeWebhookRoute from './routes/stripeWebhook.js';    // Webhook handler
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Stripe Webhook Route (⚠️ must come before express.json)
app.use(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }), // required for Stripe webhook
  stripeWebhookRoute
);

// Normal Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json()); // JSON parsing after webhook raw body
app.use(cookieParser());

// API Routes
app.use('/api/user', authRoutes);              // User + Dealer Auth
app.use('/api/admin', adminRoutes);            // Admin-only Auth
app.use('/api/vehicles', vehicleRoutes);       // Vehicles CRUD
app.use('/api/stripe', stripeCheckoutRoute);   // Stripe Checkout
app.use('/api/reviews', reviewRoutes);         // Reviews CRUD

// Health Check Route
app.get('/', (req, res) => {
  res.send('🚗 Car Rental API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
