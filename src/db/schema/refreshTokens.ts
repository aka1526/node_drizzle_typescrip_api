
import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
import { UserTable } from './users';

export const refreshTokensTB = mysqlTable('refresh_tokens', {
  uuid: varchar('uuid', { length: 50 }).primaryKey() ,
  user_uuid: varchar('user_uuid', { length: 50 }).notNull().references(() => UserTable.uuid),
  token: varchar('token', { length: 200 }).notNull(),
  expires_at: timestamp('expires_at', { mode:  "string" ,fsp: 0} ).notNull(),
  created_at: timestamp('created_at', { mode:   "string" ,fsp: 0}).defaultNow(),
}, (table) => {
  return {
    ifNotExists: true,
  
     
  };
});

 