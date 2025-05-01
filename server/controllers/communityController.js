// server/controllers/communityController.js

import CommunityFeedback from '../models/CommunityFeedback.js';

/**
 * @desc    Submit community feedback
 * @route   POST /api/community/feedback
 * @access  Private
 */
const submitFeedback = async(req, res) => {
    try {
        const {
            currentCrops,
            plannedCrops,
            farmingMethod,
            farmSize,
            farmingExperience,
            challenges,
            preferredAssistance,
            notes,
            improvementSuggestions,
            farmingArea,
            preferredCommunication
        } = req.body;

        const feedback = new CommunityFeedback({
            user: req.user._id,
            currentCrops,
            plannedCrops,
            farmingMethod,
            farmSize,
            farmingExperience,
            challenges,
            preferredAssistance,
            notes,
            improvementSuggestions,
            farmingArea,
            preferredCommunication
        });

        const createdFeedback = await feedback.save();

        res.status(201).json(createdFeedback);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
};

/**
 * @desc    Get user's feedback submissions
 * @route   GET /api/community/feedback
 * @access  Private
 */
const getUserFeedback = async(req, res) => {
    try {
        const feedback = await CommunityFeedback.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
};

/**
 * @desc    Get all feedback submissions (admin only)
 * @route   GET /api/community/feedback/all
 * @access  Private/Admin
 */
const getAllFeedback = async(req, res) => {
    try {
        const feedback = await CommunityFeedback.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
};

/**
 * @desc    Get feedback statistics (admin only)
 * @route   GET /api/community/feedback/stats
 * @access  Private/Admin
 */
const getFeedbackStats = async(req, res) => {
    try {
        // Count by farming method
        const methodStats = await CommunityFeedback.aggregate([
            { $group: { _id: '$farmingMethod', count: { $sum: 1 } } }
        ]);

        // Count by farm size
        const sizeStats = await CommunityFeedback.aggregate([
            { $group: { _id: '$farmSize', count: { $sum: 1 } } }
        ]);

        // Count by farming experience
        const experienceStats = await CommunityFeedback.aggregate([
            { $group: { _id: '$farmingExperience', count: { $sum: 1 } } }
        ]);

        // Top challenges
        const challengeStats = await CommunityFeedback.aggregate([
            { $unwind: '$challenges' },
            { $group: { _id: '$challenges', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Top needed assistance
        const assistanceStats = await CommunityFeedback.aggregate([
            { $unwind: '$preferredAssistance' },
            { $group: { _id: '$preferredAssistance', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Most popular crops
        const cropStats = await CommunityFeedback.aggregate([
            { $unwind: '$currentCrops' },
            { $group: { _id: '$currentCrops', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Planned crops
        const plannedCropStats = await CommunityFeedback.aggregate([
            { $unwind: '$plannedCrops' },
            { $group: { _id: '$plannedCrops', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Farming area stats
        const areaStats = await CommunityFeedback.aggregate([
            { $match: { farmingArea: { $ne: '' } } },
            { $group: { _id: '$farmingArea', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Communication preference stats
        const commStats = await CommunityFeedback.aggregate([
            { $group: { _id: '$preferredCommunication', count: { $sum: 1 } } }
        ]);

        res.json({
            farmingMethod: methodStats,
            farmSize: sizeStats,
            farmingExperience: experienceStats,
            challenges: challengeStats,
            preferredAssistance: assistanceStats,
            currentCrops: cropStats,
            plannedCrops: plannedCropStats,
            farmingArea: areaStats,
            preferredCommunication: commStats,
            totalSubmissions: await CommunityFeedback.countDocuments()
        });
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        res.status(500).json({ message: 'Failed to fetch feedback statistics' });
    }
};

export { submitFeedback, getUserFeedback, getAllFeedback, getFeedbackStats };