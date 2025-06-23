import db from '../../db/db_connect.js';
import { userSchema } from '../../db/schema.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const createUser = async (name, email, password) => {
    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate UUID for id
        const userId = uuidv4();
        
        // Insert user into database
        const newUser = await db.insert(userSchema).values({
            id: userId,
            name: name,
            email: email,
            password: hashedPassword
        }).returning({
            id: userSchema.id,
            name: userSchema.name,
            email: userSchema.email
            // Note: password is intentionally excluded from the return
        });
        
        return {
            success: true,
            user: newUser[0]
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: error.message
        };
    }
};