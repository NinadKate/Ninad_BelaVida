import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, users, products } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendOrderNotification } from "@/lib/email";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, shippingInfo, total, locale } = body;

        console.log("Receiving Checkout Request:", { hasSession: !!session, itemsCount: items?.length });

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // 1. Validate User
        let userId = null;
        if (session?.user?.email) {
            const user = await db.query.users.findFirst({
                where: eq(users.email, session.user.email)
            });
            if (user) {
                userId = user.id;
            } else {
                console.warn(`Checkout: Logged in user not found in DB: ${session.user.email}`);
            }
        }

        // 2. Validate Products & IDs
        const productIds = items.map((item: any) => item.id);
        const validProducts = await db.query.products.findMany({
            where: inArray(products.id, productIds),
            columns: { id: true, price: true }
        });

        const validIds = new Set(validProducts.map((p: any) => p.id));
        const invalidItems = items.filter((item: any) => !validIds.has(item.id));

        if (invalidItems.length > 0) {
            console.error("Checkout Failed: Invalid Product IDs found", invalidItems);
            return NextResponse.json({
                error: "Some items in your cart are no longer available. Please clear your cart and try again."
            }, { status: 400 });
        }

        // 3. Create Order
        console.log("Creating Order for User:", userId);
        const [newOrder] = await db
            .insert(orders)
            .values({
                userId: userId,
                status: "pending",
                total: total.toString(),
                currency: "CLP",
                locale: locale || "es-CL",
                shippingInfo: shippingInfo,
            })
            .returning({ id: orders.id });

        if (!newOrder) {
            throw new Error("Failed to insert order record.");
        }

        // 4. Create Order Items
        console.log("Creating Order Items for Order:", newOrder.id);
        for (const item of items) {
            await db.insert(orderItems).values({
                orderId: newOrder.id,
                productId: item.id,
                quantity: item.quantity,
                price: item.price.toString(),
            });
        }

        // 5. Send Notification
        // Non-blocking notification
        sendOrderNotification(newOrder.id, total, "CLP", shippingInfo).catch(err => {
            console.error("Failed to send order notification:", err);
        });

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error("Checkout Critical Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
