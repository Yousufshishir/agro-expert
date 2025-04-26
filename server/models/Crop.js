// server/models/Crop.js
import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    name: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    category: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    growingSeason: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    waterRequirements: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    soilType: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    timeToHarvest: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    fertilizers: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    commonDiseases: [{
        name: {
            english: { type: String, required: true },
            bengali: { type: String, required: true }
        },
        treatment: {
            english: { type: String, required: true },
            bengali: { type: String, required: true }
        }
    }],
    pestManagement: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    yieldEstimate: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    marketValue: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    tips: {
        english: { type: String, required: true },
        bengali: { type: String, required: true }
    },
    image: { type: String, default: '/images/default-crop.jpg' },
    dateAdded: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;