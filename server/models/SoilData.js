// server/models/SoilData.js
import mongoose from 'mongoose';

const soilDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    soilType: {
        type: String,
        required: true,
        enum: ['sandy', 'clay', 'loamy', 'silty']
    },
    phLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 14
    },
    moistureLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    nutrients: {
        nitrogen: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        phosphorus: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        potassium: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    location: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a virtual for analysis count
soilDataSchema.virtual('analysisCount').get(function() {
    return this.model('SoilData').countDocuments({ user: this.user });
});

const SoilData = mongoose.model('SoilData', soilDataSchema);
export default SoilData;