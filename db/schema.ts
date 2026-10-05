import {sqliteTable,text,primaryKey} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('career_records',{id:text('id').primaryKey(),kind:text('kind').notNull(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()});
export const userRecords=sqliteTable('career_user_records',{userId:text('user_id').notNull(),id:text('id').notNull(),kind:text('kind').notNull(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.userId,t.id]})]);
