import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  max: 5, // Neon ke liye best
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 15000, // 🔥 IMPORTANT (15 sec)
});

pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});

pool.on("error", (err) => {
  console.error("💥 Database connection error:", err.message);
});

export const db = drizzle(pool, { schema });