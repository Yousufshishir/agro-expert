// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});