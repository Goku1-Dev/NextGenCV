import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Authenticate user for sign-in
export const authenticateUser = async (email, password) => {
    try {
        // Get user by email (including password for authentication)
        const user = await db.select({
            id: userSchema.id,
            name: userSchema.name,
            email: userSchema.email,
            password: userSchema.password
        }).from(userSchema).where(eq(userSchema.email, email));
        
        if (user.length === 0) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        
        if (!isPasswordValid) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }
        
        // Return user data without password
        return {
            success: true,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email
            }
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Verify user exists (useful for middleware)
export const verifyUserExists = async (id) => {
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
        console.error('Error verifying user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};