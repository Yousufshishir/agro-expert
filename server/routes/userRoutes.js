// server/routes/userRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    registerUser,
    loginUser,
    getUserProfile,
    findUserForReset,
    verifySecurityAnswer,
    resetPassword
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB max file size
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Modified routes with multer
router.post('/', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Password reset routes
router.post('/reset-password/find', findUserForReset);
router.post('/reset-password/verify', verifySecurityAnswer);
router.post('/reset-password/reset', resetPassword);

export default router;