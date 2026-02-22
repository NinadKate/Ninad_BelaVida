import { NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const uniqueFilename = `${randomUUID()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

        // Construct public URL (assuming configured custom domain or R2.dev domain)
        // If NEXT_PUBLIC_R2_URL is set (e.g. https://cdn.bellavida.cl), use it.
        // Otherwise fallback to R2 dev URL structure if possible, but usually we need a public domain.
        const publicUrl = process.env.NEXT_PUBLIC_R2_URL
            ? `${process.env.NEXT_PUBLIC_R2_URL}/${uniqueFilename}`
            : signedUrl.split('?')[0]; // Fallback to signed URL base but that expires if private bucket... 
        // Real R2 buckets are usually private for writing but public for reading via custom domain.
        // We will assume public domain exists.

        return NextResponse.json({
            uploadUrl: signedUrl,
            key: uniqueFilename,
            publicUrl: publicUrl
        });

    } catch (error) {
        console.error("Upload signature error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
