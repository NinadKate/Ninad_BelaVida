import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, shippingInfo, total, locale } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // Create Order
        const [newOrder] = await db
            .insert(orders)
            .values({
                userId: session?.user?.email ? (await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, session.user!.email!) }))?.id : null,
                status: "pending",
                total: total.toString(),
                currency: "CLP",
                locale: locale,
                shippingInfo: shippingInfo,
            })
            .returning({ id: orders.id });

        // Create Order Items
        for (const item of items) {
            await db.insert(orderItems).values({
                orderId: newOrder.id,
                productId: item.id,
                quantity: item.quantity,
                price: item.price.toString(),
            });
        }

        // TODO: Send email notification to admin using Resend

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
