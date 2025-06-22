import express from 'express';
import cors from 'cors';
import { createUser } from './Users/create.js'; 
import { getUserById, getUserByEmail, getAllUsers } from './Users/read.js';
import { updateUser, updateUserEmail, updateUserPassword } from './Users/update.js';
import { deleteUser, deleteUserByEmail } from './Users/delete.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (MOVED BEFORE PARAMETERIZED ROUTES)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// CREATE - Create a new user
app.post('/users', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required'
        });
    }
    
    const result = await createUser(email, password);
    
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
});

// READ - Get all users (MOVED BEFORE PARAMETERIZED ROUTES)
app.get('/users', async (req, res) => {
    const result = await getAllUsers();
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});

// READ - Get user by email (SPECIFIC ROUTE BEFORE GENERIC :id ROUTE)
app.get('/users/email/:email', async (req, res) => {
    const { email } = req.params;
    const result = await getUserByEmail(email);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

// DELETE - Delete user by email (SPECIFIC ROUTE BEFORE GENERIC :id ROUTE)
app.delete('/users/email/:email', async (req, res) => {
    const { email } = req.params;
    const result = await deleteUserByEmail(email);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

// UPDATE - Update user email only
app.patch('/users/:id/email', async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }
    
    const result = await updateUserEmail(id, email);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
});

// UPDATE - Update user password only
app.patch('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({
            success: false,
            error: 'Password is required'
        });
    }
    
    const result = await updateUserPassword(id, password);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
});

// READ - Get user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUserById(id);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

// UPDATE - Update user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const result = await updateUser(id, updates);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
});

// DELETE - Delete user by ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteUser(id);
    
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler - Using a safer approach
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;