 
import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
export const revokedTokensTB = mysqlTable('revoked_tokens', {
  token: varchar('token', { length: 200 }).primaryKey(),
  revokedAt: timestamp('revoked_at', { mode:  "string" ,fsp: 0} ).defaultNow(),
} , (table) => {
    return {
      ifNotExists: true,
    
       
    };
  });