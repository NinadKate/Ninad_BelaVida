import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db.update(orders)
            .set({ status })
            .where(eq(orders.id, orderId));

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Error updating order status:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
