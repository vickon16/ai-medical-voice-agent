import pgk from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const { Pool } = pgk;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema });

// -------------------------------------------------

// For NeonDatabase

// import { Pool } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import * as schema from "./schema";

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
// export const db = drizzle(pool, { schema });
