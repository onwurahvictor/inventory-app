import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    try {
        console.log('Received user data:', req.body); // Debug log
        
        const { userName, email, password, role } = req.body;

        // Validate required fields
        if (!userName || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Please provide all required fields',
                missing: {
                    userName: !userName,
                    email: !email,
                    password: !password
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { userName }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'User with this email or username already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Save to database
        const savedUser = await newUser.save();

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                error: 'Validation failed',
                details: errors 
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false,
                error: `${field} already exists` 
            });
        }

        res.status(500).json({ 
            success: false,
            error: 'Server error' 
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false,
            error: 'Server error' 
        });
    }
});

// Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ 
            success: false,
            error: 'Server error' 
        });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { userName, email, role } = req.body;
        
        // Build update object
        const updateData = {};
        if (userName) updateData.userName = userName;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            success: false,
            error: 'Server error' 
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false,
            error: 'Server error' 
        });
    }
});

export default router;