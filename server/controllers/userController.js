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

        if (securityQuestion === user.securityQuestion1) {
            questionNumber = 1;
        } else if (securityQuestion === user.securityQuestion2) {
            questionNumber = 2;
        } else if (securityQuestion === user.securityQuestion3) {
            questionNumber = 3;
        } else {
            return res.status(400).json({ message: 'Invalid security question' });
        }

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

        if (securityQuestion === user.securityQuestion1) {
            questionNumber = 1;
        } else if (securityQuestion === user.securityQuestion2) {
            questionNumber = 2;
        } else if (securityQuestion === user.securityQuestion3) {
            questionNumber = 3;
        } else {
            return res.status(400).json({ message: 'Invalid security question' });
        }

        const isCorrect = await user.matchSecurityAnswer(questionNumber, securityAnswer);

        if (!isCorrect) {
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (req.user._id.toString() !== req.params.id) {
            res.status(401);
            throw new Error('Not authorized to update this profile');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.district = req.body.district || user.district;
        user.farmSize = req.body.farmSize || user.farmSize;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            district: updatedUser.district,
            farmSize: updatedUser.farmSize,
            token: req.user.token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
// In userController.js
const deleteUser = async(req, res) => {
    try {
        console.log('Delete user request for ID:', req.params.id);

        const user = await User.findById(req.params.id);

        if (!user) {
            console.log('User not found with ID:', req.params.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Found user:', user.name);

        // If you want to temporarily bypass this check for testing
        // comment it out or modify it
        /*
        if (req.user._id.toString() !== req.params.id) {
          console.log('Auth error: Request user ID:', req.user._id, 'Param ID:', req.params.id);
          return res.status(401).json({ message: 'Not authorized to delete this account' });
        }
        */

        await User.deleteOne({ _id: req.params.id });
        console.log('User deleted successfully');

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(400).json({ message: error.message });
    }
};

// Final export
export {
    registerUser,
    loginUser,
    getUserProfile,
    findUserForReset,
    verifySecurityAnswer,
    resetPassword,
    updateUserProfile,
    deleteUser
};