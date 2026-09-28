const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const { authenticateToken } = require('../middleware/auth');


// ==========================================
// GET PROFILE
// ==========================================
router.get('/', authenticateToken, async (req, res) => {
    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `SELECT 
                user_id,
                full_name,
                email,
                shipping_address,
                created_at
             FROM users
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error('Get profile error:', error);

        res.status(500).json({
            message: 'Failed to load profile'
        });
    }
});


// ==========================================
// UPDATE PROFILE
// ==========================================
router.put('/', authenticateToken, async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
            full_name,
            email
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET 
                full_name = $1,
                email = $2
             WHERE user_id = $3
             RETURNING
                user_id,
                full_name,
                email,
                shipping_address,
                created_at`,
            [
                full_name,
                email,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {

        console.error('Update profile error:', error);

        res.status(500).json({
            message: 'Failed to update profile'
        });
    }
});


// ==========================================
// UPDATE SHIPPING ADDRESS
// ==========================================
router.put('/address', authenticateToken, async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
            shipping_address
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET shipping_address = $1
             WHERE user_id = $2
             RETURNING
                user_id,
                shipping_address`,
            [
                shipping_address,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Shipping address updated successfully',
            address: result.rows[0]
        });

    } catch (error) {

        console.error('Update address error:', error);

        res.status(500).json({
            message: 'Failed to update shipping address'
        });
    }
});


// ==========================================
// UPDATE PASSWORD
// ==========================================
router.put('/password', authenticateToken, async (req, res) => {
    try {

        const userId = req.user.user_id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        // Check that both passwords were provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            });
        }

        // Get current password hash
        const result = await pool.query(
            `SELECT password_hash
             FROM users
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Compare current password with stored hash
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(
            newPassword,
            10
        );

        // Save new password
        await pool.query(
            `UPDATE users
             SET password_hash = $1
             WHERE user_id = $2`,
            [
                newPasswordHash,
                userId
            ]
        );

        res.json({
            message: 'Password updated successfully'
        });

    } catch (error) {

        console.error('Update password error:', error);

        res.status(500).json({
            message: 'Failed to update password'
        });
    }
});


module.exports = router;