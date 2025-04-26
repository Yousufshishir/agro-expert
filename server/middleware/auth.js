// server/middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return; // Add return to prevent further execution
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return; // Add return to prevent further execution
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is admin, so proceed
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, admin };