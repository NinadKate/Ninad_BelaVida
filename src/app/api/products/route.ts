import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { users } from "@/lib/db/schema";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;
    const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
    return user?.role === 'admin';
}

export async function POST(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { slug, sku, price, prices, name, description, categoryId, images, stock } = body;

        // Basic validation
        if (!slug || !price || !name || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check for duplicate SKU
        if (sku !== undefined && sku !== null && sku !== "") {
            const existingProduct = await db.query.products.findFirst({
                where: eq(products.sku, sku)
            });
            if (existingProduct) {
                return NextResponse.json({ error: `A product with SKU '${sku}' already exists.` }, { status: 409 });
            }
        }

        await db.insert(products).values({
            slug,
            sku,
            price: price.toString(),
            prices: prices || {},
            name,
            description,
            categoryId: Number(categoryId),
            images,
            stock: Number(stock),
            active: true
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, slug, sku, price, prices, name, description, categoryId, images, stock, active } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        // Check for duplicate SKU

        if (sku) {
            const existingProduct = await db.query.products.findFirst({
                where: eq(products.sku, sku)
            });
            if (existingProduct && existingProduct.id !== id) {
                return NextResponse.json({ error: `A product with SKU '${sku}' already exists.` }, { status: 409 });
            }
        }


        // Only pass explicitly known fields to prevent Drizzle errors from unknown client-side keys
        const updates: Record<string, any> = {};
        if (slug !== undefined) updates.slug = slug;
        if (sku !== undefined) updates.sku = sku;
        if (price !== undefined) updates.price = price.toString();
        if (prices !== undefined) updates.prices = prices;
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (categoryId !== undefined) updates.categoryId = Number(categoryId);
        if (images !== undefined) updates.images = images;
        if (stock !== undefined) updates.stock = Number(stock);
        if (active !== undefined) updates.active = active;

        await db.update(products)
            .set(updates)
            .where(eq(products.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await db.delete(products).where(eq(products.id, Number(id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
