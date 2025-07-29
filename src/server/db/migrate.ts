import "dotenv/config";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db, pool } from "./index";
import { WebSocket } from "ws"; // Add this

// Explicitly set WebSocket
(globalThis as any).WebSocket = WebSocket;

async function runMigrate() {
  console.log("⏳ Running migrations...");
  console.log("env", process.env.DATABASE_URL);

  try {
    await migrate(db, { migrationsFolder: "./src/server/db/migrations" });
    console.log("✅ Migrations completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrate();
