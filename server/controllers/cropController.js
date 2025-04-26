// server/controllers/cropController.js
import Crop from '../models/Crop.js';

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
export const getCrops = async(req, res) => {
    try {
        const crops = await Crop.find({});
        res.json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Public
export const getCropById = async(req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            res.json(crop);
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a crop
// @route   POST /api/crops
// @access  Private/Admin
export const createCrop = async(req, res) => {
    try {
        const crop = new Crop(req.body);
        const createdCrop = await crop.save();
        res.status(201).json(createdCrop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private/Admin
export const updateCrop = async(req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            Object.assign(crop, req.body);
            const updatedCrop = await crop.save();
            res.json(updatedCrop);
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private/Admin
export const deleteCrop = async(req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            await crop.remove();
            res.json({ message: 'Crop removed' });
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};