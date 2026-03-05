import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { randomUUID, createHmac, createHash } from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Pure Node.js AWS4 presigned URL generation — no aws-sdk dependency.
// This avoids the Turbopack Windows junction-point bug.

function hmac(key: Buffer | string, data: string) {
    return createHmac("sha256", key).update(data).digest();
}

function sha256(data: string) {
    return createHash("sha256").update(data).digest("hex");
}

function getSignedR2UploadUrl(params: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    key: string;
    contentType: string;
    expiresIn?: number;
}) {
    const { accountId, accessKeyId, secretAccessKey, bucket, key, contentType, expiresIn = 3600 } = params;
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const region = "auto";
    const service = "s3";

    const now = new Date();
    const datetime = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const date = datetime.slice(0, 8);

    const credentialScope = `${date}/${region}/${service}/aws4_request`;
    const credential = `${accessKeyId}/${credentialScope}`;

    const path = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;

    const queryParams = new URLSearchParams({
        "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
        "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
        "X-Amz-Credential": credential,
        "X-Amz-Date": datetime,
        "X-Amz-Expires": String(expiresIn),
        "X-Amz-SignedHeaders": "content-type;host",
    });

    // Sort query params for canonical form
    const sortedParams = new URLSearchParams([...queryParams.entries()].sort());
    const canonicalQueryString = sortedParams.toString().replace(/\+/g, "%20");

    const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`;
    const signedHeaders = "content-type;host";

    const canonicalRequest = [
        "PUT",
        path,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        "UNSIGNED-PAYLOAD",
    ].join("\n");

    const stringToSign = [
        "AWS4-HMAC-SHA256",
        datetime,
        credentialScope,
        sha256(canonicalRequest),
    ].join("\n");

    const signingKey = hmac(
        hmac(
            hmac(
                hmac(Buffer.from(`AWS4${secretAccessKey}`, "utf8"), date),
                region
            ),
            service
        ),
        "aws4_request"
    );

    const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

    sortedParams.set("X-Amz-Signature", signature);

    return `https://${host}${path}?${sortedParams.toString().replace(/\+/g, "%20")}`;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { filename, contentType } = await req.json();
        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucket = process.env.R2_BUCKET_NAME || "bellavida-uploads";

        if (!accountId || !accessKeyId || !secretAccessKey) {
            return NextResponse.json({ error: "R2 credentials not configured" }, { status: 500 });
        }

        const uniqueFilename = `${randomUUID()}-${filename}`;

        const uploadUrl = getSignedR2UploadUrl({
            accountId,
            accessKeyId,
            secretAccessKey,
            bucket,
            key: uniqueFilename,
            contentType,
            expiresIn: 3600,
        });

        const publicUrl = process.env.NEXT_PUBLIC_R2_URL
            ? `${process.env.NEXT_PUBLIC_R2_URL}/${uniqueFilename}`
            : uploadUrl.split("?")[0];

        return NextResponse.json({ uploadUrl, key: uniqueFilename, publicUrl });

    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
