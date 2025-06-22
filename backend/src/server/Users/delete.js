import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js'; // Fixed import path
import { eq } from 'drizzle-orm';

// Delete user by ID
export const deleteUser = async (id) => {
    try {
        const deletedUser = await db.delete(userSchema)
            .where(eq(userSchema.id, id))
            .returning({
                id: userSchema.id,
                email: userSchema.email
            });
        
        if (deletedUser.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            message: 'User deleted successfully',
            deletedUser: deletedUser[0]
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete user by email
export const deleteUserByEmail = async (email) => {
    try {
        const deletedUser = await db.delete(userSchema)
            .where(eq(userSchema.email, email))
            .returning({
                id: userSchema.id,
                email: userSchema.email
            });
        
        if (deletedUser.length === 0) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        
        return {
            success: true,
            message: 'User deleted successfully',
            deletedUser: deletedUser[0]
        };
    } catch (error) {
        console.error('Error deleting user by email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};