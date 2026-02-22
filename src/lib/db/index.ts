import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import ws from "ws";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

// Enable WebSocket for better resilience in Node.js environments
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
