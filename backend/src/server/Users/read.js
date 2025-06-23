import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js'; // Fixed import path
import { eq } from 'drizzle-orm';

// Get user by ID
export const getUserById = async (id) => {
    try {
        const user = await db.select({
            id: userSchema.id,
            name: userSchema.name,
            email: userSchema.email
        }).from(userSchema).where(eq(userSchema.id, id));
        
        if (user.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            user: user[0]
        };
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get user by email
export const getUserByEmail = async (email) => {
    try {
        const user = await db.select({
            id: userSchema.id,
            email: userSchema.email
        }).from(userSchema).where(eq(userSchema.email, email));
        
        if (user.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            user: user[0]
        };
    } catch (error) {
        console.error('Error getting user by email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get all users
export const getAllUsers = async () => {
    try {
        const users = await db.select({
            id: userSchema.id,
            name: userSchema.name,
            email: userSchema.email
        }).from(userSchema);
        
        return {
            success: true,
            users: users
        };
    } catch (error) {
        console.error('Error getting all users:', error);
        return {
            success: false,
            error: error.message
        };
    }
};