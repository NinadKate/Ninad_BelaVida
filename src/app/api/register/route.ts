import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    try {
        const { email, password, name, phone, address } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            id: randomUUID(),
            email,
            name,
            phone,
            address,
            password: hashedPassword,
            role: "user"
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
