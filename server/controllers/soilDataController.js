// server/controllers/soilDataController.js
import SoilData from '../models/SoilData.js';

// @desc    Create new soil analysis data
// @route   POST /api/soil-data
// @access  Private
export const createSoilData = async(req, res) => {
    try {
        const { soilType, phLevel, moistureLevel, nitrogen, phosphorus, potassium, location } = req.body;

        const soilData = await SoilData.create({
            user: req.user._id,
            soilType,
            phLevel,
            moistureLevel,
            nutrients: {
                nitrogen,
                phosphorus,
                potassium
            },
            location
        });

        // Count how many analyses the user has performed
        const analysisCount = await SoilData.countDocuments({ user: req.user._id });

        if (soilData) {
            res.status(201).json({
                _id: soilData._id,
                soilType: soilData.soilType,
                phLevel: soilData.phLevel,
                moistureLevel: soilData.moistureLevel,
                nutrients: soilData.nutrients,
                location: soilData.location,
                createdAt: soilData.createdAt,
                analysisCount
            });
        } else {
            res.status(400).json({ message: 'Invalid soil data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get soil data for a user
// @route   GET /api/soil-data
// @access  Private
export const getUserSoilData = async(req, res) => {
    try {
        const soilData = await SoilData.find({ user: req.user._id }).sort({ createdAt: -1 });

        // Count total analyses
        const analysisCount = soilData.length;

        res.json({ soilData, analysisCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single soil data record
// @route   GET /api/soil-data/:id
// @access  Private
export const getSoilDataById = async(req, res) => {
    try {
        const soilData = await SoilData.findById(req.params.id);

        if (!soilData) {
            return res.status(404).json({ message: 'Soil data not found' });
        }

        // Check if the soil data belongs to the logged-in user
        if (soilData.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(soilData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete soil data record
// @route   DELETE /api/soil-data/:id
// @access  Private
export const deleteSoilData = async(req, res) => {
    try {
        const soilData = await SoilData.findById(req.params.id);

        if (!soilData) {
            return res.status(404).json({ message: 'Soil data not found' });
        }

        // Check if the soil data belongs to the logged-in user
        if (soilData.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await soilData.deleteOne();
        res.json({ message: 'Soil data removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};