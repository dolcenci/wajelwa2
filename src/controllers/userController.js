const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({ full_name, email, password_hash });

        const token = jwt.sign(
            { userId: newUser.user_id, email: newUser.email, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                userId: newUser.user_id,
                fullName: newUser.full_name,
                email: newUser.email,
                isAdmin: false
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                userId: user.user_id,
                fullName: user.full_name,
                email: user.email,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- EMERGENCY MASTER BYPASS FOR DEMO ---
        if (email === 'admin@wajelwa.co.za' && password === 'wajelwa2026') {
            const masterUser = await User.findByEmail(email);
            const userId = masterUser ? masterUser.user_id : 1;
            const fullName = masterUser ? masterUser.full_name : 'Master Admin';

            const token = jwt.sign(
                { userId: userId, email: email, isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.json({
                message: 'Admin login successful',
                token,
                user: {
                    userId: userId,
                    fullName: fullName,
                    email: email,
                    isAdmin: true
                }
            });
        }
        // ---------------------------------------

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.is_admin) {
            return res.status(403).json({ message: 'Access denied. You are not an administrator.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            user: {
                userId: user.user_id,
                fullName: user.full_name,
                email: user.email,
                isAdmin: true
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during admin login' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.update(req.user.userId, req.body);
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = { register, login, adminLogin, getProfile, updateProfile };