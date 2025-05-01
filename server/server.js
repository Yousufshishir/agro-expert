import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import soilDataRoutes from './routes/soilDataRoutes.js'; // ✅ Added
import communityRoutes from './routes/communityRoutes.js';
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Setup __dirname in ES Modules
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil-data', soilDataRoutes); // ✅ Added
app.use('/api/community', communityRoutes); // Add the community routes
// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Error handling middleware
// app.use(notFound);
// app.use(errorHandler);
// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});