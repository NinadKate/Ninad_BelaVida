import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;
    const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
    return user?.role === 'admin';
}

export async function GET(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Query to fetch all SKUs, convert them to integers (ignoring non-integer SKUs), 
        // and find the maximum value to generate the next one.
        const allProducts = await db.select({ sku: products.sku }).from(products);

        let maxSku = 0;
        for (const p of allProducts) {
            if (p.sku) {
                const parsed = parseInt(p.sku, 10);
                if (!isNaN(parsed) && parsed > maxSku) {
                    maxSku = parsed;
                }
            }
        }

        // Start from 100 if there are no existing integer SKUs, otherwise increment by 1
        const nextSku = maxSku > 0 ? maxSku + 1 : 100;

        return NextResponse.json({ nextSku: nextSku.toString() });
    } catch (error) {
        console.error("Get next SKU error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
