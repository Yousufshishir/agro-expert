// server/models/CommunityFeedback.js

import mongoose from 'mongoose';

const communityFeedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    currentCrops: {
        type: [String],
        default: []
    },
    plannedCrops: {
        type: [String],
        default: []
    },
    farmingMethod: {
        type: String,
        enum: ['conventional', 'organic', 'hybrid'],
        default: 'conventional'
    },
    farmSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'small'
    },
    farmingExperience: {
        type: String,
        enum: ['beginner', 'intermediate', 'experienced'],
        default: 'beginner'
    },
    challenges: {
        type: [String],
        default: []
    },
    preferredAssistance: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        default: ''
    },
    improvementSuggestions: {
        type: String,
        default: ''
    },
    farmingArea: {
        type: String,
        default: ''
    },
    preferredCommunication: {
        type: String,
        enum: ['app', 'sms', 'email', 'whatsapp'],
        default: 'app'
    }
}, {
    timestamps: true
});

const CommunityFeedback = mongoose.model('CommunityFeedback', communityFeedbackSchema);

export default CommunityFeedback;