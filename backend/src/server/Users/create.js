import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const createUser = async (email, password) => {
    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate UUID for id
        const userId = uuidv4();
        
        // Insert user into database
        const newUser = await db.insert(userSchema).values({
            id: userId,
            email: email,
            password: hashedPassword
        }).returning();
        
        return {
            success: true,
            user: {
                id: newUser[0].id,
                email: newUser[0].email
            }
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};