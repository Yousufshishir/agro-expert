import express from 'express';
import {
    submitFeedback,
    getUserFeedback,
    getAllFeedback,
    respondToFeedback
} from '../controllers/communityController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.route('/feedback')
    .post(protect, submitFeedback)
    .get(protect, getUserFeedback);

// Admin routes
router.route('/feedback/all')
    .get(protect, admin, getAllFeedback);

router.route('/feedback/:id')
    .put(protect, admin, respondToFeedback);

export default router;