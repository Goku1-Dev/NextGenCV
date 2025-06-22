import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js'; // Fixed import path
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Update user email
export const updateUserEmail = async (id, newEmail) => {
    try {
        const updatedUser = await db.update(userSchema)
            .set({ email: newEmail })
            .where(eq(userSchema.id, id))
            .returning({
                id: userSchema.id,
                email: userSchema.email
            });
        
        if (updatedUser.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            user: updatedUser[0]
        };
    } catch (error) {
        console.error('Error updating user email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Update user password
export const updateUserPassword = async (id, newPassword) => {
    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        const updatedUser = await db.update(userSchema)
            .set({ password: hashedPassword })
            .where(eq(userSchema.id, id))
            .returning({
                id: userSchema.id,
                email: userSchema.email
            });
        
        if (updatedUser.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            user: updatedUser[0]
        };
    } catch (error) {
        console.error('Error updating user password:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Update user (email and/or password)
export const updateUser = async (id, updates) => {
    try {
        const updateData = {};
        
        if (updates.email) {
            updateData.email = updates.email;
        }
        
        if (updates.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updates.password, saltRounds);
        }
        
        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                error: 'No valid fields to update'
            };
        }
        
        const updatedUser = await db.update(userSchema)
            .set(updateData)
            .where(eq(userSchema.id, id))
            .returning({
                id: userSchema.id,
                email: userSchema.email
            });
        
        if (updatedUser.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            user: updatedUser[0]
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};