// server/routes/soilDataRoutes.js
import express from 'express';
import {
    createSoilData,
    getUserSoilData,
    getSoilDataById,
    deleteSoilData
} from '../controllers/soilDataController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createSoilData)
    .get(protect, getUserSoilData);

router.route('/:id')
    .get(protect, getSoilDataById)
    .delete(protect, deleteSoilData);

export default router;