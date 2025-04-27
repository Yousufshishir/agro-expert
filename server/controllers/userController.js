// server/controllers/userController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            division,
            district,
            farmSize,
            securityQuestion1,
            securityAnswer1,
            securityQuestion2,
            securityAnswer2,
            securityQuestion3,
            securityAnswer3,
        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            division,
            district,
            farmSize,
            securityQuestion1,
            securityAnswer1,
            securityQuestion2,
            securityAnswer2,
            securityQuestion3,
            securityAnswer3,
            // profileImage will be handled separately if needed
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                division: user.division,
                district: user.district,
                farmSize: user.farmSize,
                profileImage: user.profileImage,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Find user by email for password reset
// @route   POST /api/users/reset-password/find
// @access  Public
export const findUserForReset = async(req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return only the security questions (not the answers)
        res.json({
            securityQuestions: [
                user.securityQuestion1,
                user.securityQuestion2,
                user.securityQuestion3
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify security answer
// @route   POST /api/users/reset-password/verify
// @access  Public
export const verifySecurityAnswer = async(req, res) => {
    try {
        const { email, securityQuestion, securityAnswer } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let isCorrect = false;
        let questionNumber = 0;

        // Determine which security question was answered
        if (securityQuestion === user.securityQuestion1) {
            questionNumber = 1;
        } else if (securityQuestion === user.securityQuestion2) {
            questionNumber = 2;
        } else if (securityQuestion === user.securityQuestion3) {
            questionNumber = 3;
        } else {
            return res.status(400).json({ message: 'Invalid security question' });
        }

        // Verify the security answer
        isCorrect = await user.matchSecurityAnswer(questionNumber, securityAnswer);

        if (!isCorrect) {
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset password
// @route   POST /api/users/reset-password/reset
// @access  Public
export const resetPassword = async(req, res) => {
    try {
        const { email, securityQuestion, securityAnswer, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let questionNumber = 0;

        // Determine which security question was answered
        if (securityQuestion === user.securityQuestion1) {
            questionNumber = 1;
        } else if (securityQuestion === user.securityQuestion2) {
            questionNumber = 2;
        } else if (securityQuestion === user.securityQuestion3) {
            questionNumber = 3;
        } else {
            return res.status(400).json({ message: 'Invalid security question' });
        }

        // Verify the security answer again for extra security
        const isCorrect = await user.matchSecurityAnswer(questionNumber, securityAnswer);

        if (!isCorrect) {
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};