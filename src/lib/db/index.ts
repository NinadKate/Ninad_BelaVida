import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import ws from "ws";

const databaseUrl = process.env.DATABASE_URL;

function createDb(connectionString: string) {
    return drizzle(new Pool({
        connectionString,
    }), { schema });
}

type AppDb = ReturnType<typeof createDb>;

function createMissingDatabaseProxy() {
    const error = new Error("DATABASE_URL is not set. Add it to your deployment environment before using database features.");

    return new Proxy({} as AppDb, {
        get() {
            throw error;
        },
        apply() {
            throw error;
        },
        construct() {
            throw error;
        },
    });
}

// Enable WebSocket for better resilience in Node.js environments
neonConfig.webSocketConstructor = ws;

export const db: AppDb = databaseUrl
    ? createDb(databaseUrl)
    : createMissingDatabaseProxy();
