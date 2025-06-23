import express from 'express';
import cors from 'cors';
import { createUser } from './Users/create.js'; 
import { getUserById, getAllUsers, getUserByEmail } from './Users/read.js';
import { updateUser } from './Users/update.js';
import { deleteUser } from './Users/delete.js';
import { authenticateUser } from './Users/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sign-up endpoint
app.post('/user_signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and password are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }
        
        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser.success) {
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
            });
        }
        
        // Create new user
        const result = await createUser(name, email, password);
        
        if (result.success) {
            // Don't send password in response
            const { password: _, ...userWithoutPassword } = result.user;
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: userWithoutPassword
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Sign-in endpoint
app.post('/user_signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // Authenticate user
        const result = await authenticateUser(email, password);
        
        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Sign-in successful',
                user: result.user
            });
        } else {
            res.status(401).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Additional user management endpoints
app.get('/users', async (req, res) => {
    try {
        const result = await getAllUsers();
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getUserById(id);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const result = await updateUser(id, updates);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUser(id);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;