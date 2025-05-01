// server/routes/communityRoutes.js

import express from 'express';
import {
    submitFeedback,
    getUserFeedback,
    getAllFeedback,
    getFeedbackStats
} from '../controllers/communityController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/feedback', protect, submitFeedback);
router.get('/feedback', protect, getUserFeedback);

// Admin routes
router.get('/feedback/all', protect, admin, getAllFeedback);
router.get('/feedback/stats', protect, admin, getFeedbackStats);

export default router;