import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

if (!process.env.DB_URL) {
throw new Error("DB credentials error");
}
const connection = mysql.createConnection({
  uri: process.env.DB_URL,
  timezone: '+07:00',
  dateStrings: true
});

export const db = drizzle(connection);
