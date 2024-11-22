import {  defineConfig, type Config} from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

if (!process.env.DB_URL) {
  throw new Error("DB URL is missing");
}
export default defineConfig({
  dialect: "mysql",
  verbose: true,
  schema: "./src/db/schema/*",  // Make sure this directory exists
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});