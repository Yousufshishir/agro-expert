import asyncHandler from 'express-async-handler';
import CommunityFeedback from '../models/CommunityFeedback.js';

// @desc    Submit community feedback
// @route   POST /api/community/feedback
// @access  Private
const submitFeedback = asyncHandler(async(req, res) => {
    const { currentCrops, futureCrops, challenges, suggestions, communityQuestion } = req.body;

    if (!currentCrops) {
        res.status(400);
        throw new Error('Please provide information about your current crops');
    }

    const feedback = await CommunityFeedback.create({
        user: req.user._id,
        currentCrops,
        futureCrops,
        challenges,
        suggestions,
        communityQuestion
    });

    if (feedback) {
        res.status(201).json({
            _id: feedback._id,
            message: 'Feedback submitted successfully'
        });
    } else {
        res.status(400);
        throw new Error('Invalid feedback data');
    }
});

// @desc    Get all feedback for a user
// @route   GET /api/community/feedback
// @access  Private
const getUserFeedback = asyncHandler(async(req, res) => {
    const feedback = await CommunityFeedback.find({ user: req.user._id }).sort('-createdAt');
    res.json(feedback);
});

// @desc    Get all community feedback
// @route   GET /api/community/feedback/all
// @access  Private/Admin
const getAllFeedback = asyncHandler(async(req, res) => {
    const feedback = await CommunityFeedback.find({})
        .populate('user', 'name email')
        .sort('-createdAt');
    res.json(feedback);
});

// @desc    Update feedback with admin response
// @route   PUT /api/community/feedback/:id
// @access  Private/Admin
const respondToFeedback = asyncHandler(async(req, res) => {
    const { adminResponse } = req.body;

    const feedback = await CommunityFeedback.findById(req.params.id);

    if (feedback) {
        feedback.adminResponse = adminResponse;
        feedback.isReviewed = true;

        const updatedFeedback = await feedback.save();
        res.json(updatedFeedback);
    } else {
        res.status(404);
        throw new Error('Feedback not found');
    }
});

export { submitFeedback, getUserFeedback, getAllFeedback, respondToFeedback };