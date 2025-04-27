// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    division: {
        type: String,
    },
    district: {
        type: String,
    },
    farmSize: {
        type: Number,
    },
    profileImage: {
        type: String, // Store the URL or file path
    },
    // Security questions and answers
    securityQuestion1: {
        type: String,
        required: [true, 'Please provide security question 1'],
    },
    securityAnswer1: {
        type: String,
        required: [true, 'Please provide answer to security question 1'],
    },
    securityQuestion2: {
        type: String,
        required: [true, 'Please provide security question 2'],
    },
    securityAnswer2: {
        type: String,
        required: [true, 'Please provide answer to security question 2'],
    },
    securityQuestion3: {
        type: String,
        required: [true, 'Please provide security question 3'],
    },
    securityAnswer3: {
        type: String,
        required: [true, 'Please provide answer to security question 3'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Encrypt security answers using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('securityAnswer1') &&
        !this.isModified('securityAnswer2') &&
        !this.isModified('securityAnswer3')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    if (this.isModified('securityAnswer1')) {
        this.securityAnswer1 = await bcrypt.hash(this.securityAnswer1, salt);
    }

    if (this.isModified('securityAnswer2')) {
        this.securityAnswer2 = await bcrypt.hash(this.securityAnswer2, salt);
    }

    if (this.isModified('securityAnswer3')) {
        this.securityAnswer3 = await bcrypt.hash(this.securityAnswer3, salt);
    }

    next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to match security answers
userSchema.methods.matchSecurityAnswer = async function(questionNumber, enteredAnswer) {
    if (questionNumber === 1) {
        return await bcrypt.compare(enteredAnswer, this.securityAnswer1);
    } else if (questionNumber === 2) {
        return await bcrypt.compare(enteredAnswer, this.securityAnswer2);
    } else if (questionNumber === 3) {
        return await bcrypt.compare(enteredAnswer, this.securityAnswer3);
    }
    return false;
};

const User = mongoose.model('User', userSchema);
export default User;