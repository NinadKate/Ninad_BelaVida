import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    // In a real app, verify role against DB again or trust session if strategy includes role
    if (!session || session.user?.email !== "admin@bellavida.cl") {
        return false;
    }
    return true;
}

export async function POST(req: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { slug, sku, price, name, description, categoryId, images, stock } = body;

        // Basic validation
        if (!slug || !price || !name || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db.insert(products).values({
            slug,
            sku,
            price: price.toString(),
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
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        if (updates.price) updates.price = updates.price.toString();
        if (updates.stock) updates.stock = Number(updates.stock);
        if (updates.categoryId) updates.categoryId = Number(updates.categoryId);

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
