 
import { mysqlTable, index, uniqueIndex,varchar, timestamp} from 'drizzle-orm/mysql-core';

export  const UserTable = mysqlTable('users', {
  uuid: varchar('uuid', { length: 50 }).primaryKey() ,
  email: varchar('email', { length: 200 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
  image: varchar('image', { length: 200 }).default(''),
  firstName: varchar('first_name', { length: 200 }).default('') ,
  lastName: varchar('last_name', { length: 200 }).default(''),
  address: varchar('address', { length: 200 }).default(''),
  tel: varchar('tel', { length: 15 }).default(''),
  isActive: varchar('is_active', { length: 50 }).notNull().default('Y'),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at', { mode:  "string" ,fsp: 0} ).defaultNow(),
  updatedAt: timestamp('updated_at', { mode:  "string" ,fsp: 0},).defaultNow().onUpdateNow(),
  lastActive: timestamp('last_active', { mode:  "string" } ).defaultNow(),
  status_online: varchar('status_online', { length: 50 }).notNull().default('N'),
} , (table) => {
  return {
    ifNotExists: true,
    lastActiveIdx: index("lastActive_idx").on(table.lastActive),
     
  };
});

 