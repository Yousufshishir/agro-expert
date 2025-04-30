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
    // New fields
    organicMatter: {
        type: Number,
        default: 5,
        min: 0,
        max: 15
    },
    soilTemp: {
        type: Number,
        default: 25,
        min: 0,
        max: 50
    },
    soilColor: {
        type: String,
        default: '#8B4513'
    },
    soilDepth: {
        type: Number,
        default: 20,
        min: 5,
        max: 100
    },
    weatherCondition: {
        type: String,
        enum: ['sunny', 'cloudy', 'rainy', 'dry', 'humid'],
        default: 'sunny'
    },
    notes: {
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