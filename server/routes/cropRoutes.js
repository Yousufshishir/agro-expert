// server/routes/cropRoutes.js
import express from 'express';
import {
    getCrops,
    getCropById,
    createCrop,
    updateCrop,
    deleteCrop
} from '../controllers/cropController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getCrops)
    .post(protect, admin, createCrop);

router.route('/:id')
    .get(getCropById)
    .put(protect, admin, updateCrop)
    .delete(protect, admin, deleteCrop);

export default router;