import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function testUpload() {
    const accountId = "b52f99c823eb070ac2b115f2021584aa";
    const accessKeyId = "b5e6737789c7fd039bdfa05c106d8d85";
    const secretAccessKey = "c602368c495ff9f06cd4a5f861283a63115b652731ecddc742a8b664ad1d738b";

    const client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true,
    });

    const command = new PutObjectCommand({
        Bucket: "belavida-bucket",
        Key: "test-upload.txt",
        ContentType: "text/plain",
    });

    try {
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        console.log("Signed URL:", url);

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "text/plain",
            },
            body: "Hello world via presigned URL",
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Upload failed:", res.status, text);
        } else {
            console.log("Upload successful!");
        }
    } catch (err) {
        console.error("Error generating URL or uploading:", err);
    }
}

testUpload();
