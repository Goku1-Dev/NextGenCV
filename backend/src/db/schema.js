import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const userSchema = pgTable("users", {
    id:  varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
});
