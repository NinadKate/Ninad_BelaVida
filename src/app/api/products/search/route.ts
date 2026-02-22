import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        // Perform a case-insensitive search on the product name (stored as JSONB)
        // We'll search in the stringified JSON or specific fields if possible.
        // For simplicity with JSONB in Drizzle/Postgres without complex text search setup:
        // casting to text and doing ILIKE is a quick way for MVP.
        const searchResults = await db.query.products.findMany({
            where: (products, { sql }) => sql`CAST(${products.name} AS TEXT) ILIKE ${`%${query}%`} AND ${products.active} = true`,
            limit: 10,
            with: {
                category: true
            }
        });

        return NextResponse.json(searchResults);
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
