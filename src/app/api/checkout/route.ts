import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, users, products } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendOrderNotification } from "@/lib/email";
import { eq, inArray } from "drizzle-orm";
import { getCurrencyForLocale } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, shippingInfo, total, locale } = body;
        const normalizedItems = Array.isArray(items)
          ? items
              .map((item: any) => ({
                ...item,
                id: Number(item?.id),
                quantity: Number(item?.quantity ?? 0),
                price: Number(item?.price ?? 0),
              }))
              .filter(
                (item: any) =>
                  Number.isFinite(item.id) &&
                  item.id > 0 &&
                  Number.isFinite(item.quantity) &&
                  item.quantity > 0 &&
                  Number.isFinite(item.price),
              )
          : [];

        console.log("Receiving Checkout Request:", {
          hasSession: !!session,
          itemsCount: normalizedItems.length,
        });

        if (normalizedItems.length === 0) {
          return NextResponse.json(
            { error: "No items in cart" },
            { status: 400 },
          );
        }

        // 1. Validate User
        let userId = null;
        if (session?.user?.email) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
          });
          if (user) {
            userId = user.id;
          } else {
            console.warn(
              `Checkout: Logged in user not found in DB: ${session.user.email}`,
            );
          }
        }

        // 2. Validate Products & IDs — fetch name and sku for the email
        const productIds = normalizedItems.map((item: any) => item.id);
        const validProducts = await db.query.products.findMany({
          where: inArray(products.id, productIds),
          columns: { id: true, price: true, name: true, sku: true },
        });

        const validIds = new Set(validProducts.map((p: any) => p.id));
        const validItems = normalizedItems.filter((item: any) =>
          validIds.has(item.id),
        );
        const invalidItems = normalizedItems.filter(
          (item: any) => !validIds.has(item.id),
        );

        if (invalidItems.length > 0) {
          console.warn(
            "Checkout Warning: Skipping invalid Product IDs",
            invalidItems,
          );
          if (validItems.length === 0) {
            return NextResponse.json(
              {
                error:
                  "Some items in your cart are no longer available. Please clear your cart and try again.",
              },
              { status: 400 },
            );
          }
        }

        // Build a map for quick lookup
        const productMap = new Map(validProducts.map((p: any) => [p.id, p]));
        const validProductLookup = new Map(
          validProducts.map((p: any) => [p.id, p]),
        );
        const serverTotal = validItems.reduce((sum: number, item: any) => {
          const product = validProductLookup.get(item.id) as any;
          const unitPrice = Number(product?.price ?? item.price ?? 0);
          return sum + unitPrice * item.quantity;
        }, 0);

        // 3. Create Order
        console.log("Creating Order for User:", userId);
        const [newOrder] = await db
          .insert(orders)
          .values({
            userId: userId,
            status: "pending",
            total: serverTotal.toString(),
            currency: getCurrencyForLocale(locale || "es-CL"),
            locale: locale || "es-CL",
            shippingInfo: shippingInfo,
          })
          .returning({ id: orders.id });

        if (!newOrder) {
          throw new Error("Failed to insert order record.");
        }

        // 4. Create Order Items
        console.log("Creating Order Items for Order:", newOrder.id);
        for (const item of validItems) {
          await db.insert(orderItems).values({
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: Number(
              validProductLookup.get(item.id)?.price ?? item.price,
            ).toString(),
          });
        }

        // 5. Build enriched items for email (with name + SKU from DB)
        const emailItems = validItems.map((item: any) => {
          const dbProduct = productMap.get(item.id) as any;
          const name =
            dbProduct?.name?.[locale] ||
            dbProduct?.name?.["es-CL"] ||
            dbProduct?.name?.["en"] ||
            `Product #${item.id}`;
          return {
            name,
            sku: dbProduct?.sku || undefined,
            quantity: item.quantity,
            price: Number(validProductLookup.get(item.id)?.price ?? item.price),
            currency: getCurrencyForLocale(locale || "es-CL"),
          };
        });

        // 6. Send Notification (non-blocking)
        sendOrderNotification(
          newOrder.id,
          serverTotal,
          getCurrencyForLocale(locale || "es-CL"),
          shippingInfo,
          emailItems,
        ).catch((err) => {
          console.error("Failed to send order notification:", err);
        });

        return NextResponse.json({
          success: true,
          orderId: newOrder.id,
          skippedItems: invalidItems.length,
        });
    } catch (error) {
        console.error("Checkout Critical Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
