import { mysqlTable, varchar, text, timestamp} from 'drizzle-orm/mysql-core';

export const NotesTable = mysqlTable("note", {
  uuid: varchar("uuid", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 200 }).default(""),
  body: text("description").default(""),
  createdAt: timestamp("created_at", { mode:  "string" ,fsp: 0} ).defaultNow(),
  updatedAt: timestamp("updated_at", { mode:  "string" ,fsp: 0} ).defaultNow().onUpdateNow(),
  remark: varchar("remark", { length: 200 }).default(""),
  remark2: varchar("remark2", { length: 200 }).default(""),
}, (table) => {
  return {
    ifNotExists: true,
  
     
  };
});