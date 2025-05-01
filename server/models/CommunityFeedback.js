import mongoose from 'mongoose';

const communityFeedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    currentCrops: {
        type: String,
        required: true
    },
    futureCrops: {
        type: String,
        default: ''
    },
    challenges: {
        type: String,
        default: ''
    },
    suggestions: {
        type: String,
        default: ''
    },
    communityQuestion: {
        type: String,
        default: ''
    },
    // Optional field to track if admin has reviewed the feedback
    isReviewed: {
        type: Boolean,
        default: false
    },
    // Optional field for admin responses to questions
    adminResponse: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const CommunityFeedback = mongoose.model('CommunityFeedback', communityFeedbackSchema);

export default CommunityFeedback;