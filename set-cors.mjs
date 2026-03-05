import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";

async function setCors() {
    const accountId = "b52f99c823eb070ac2b115f2021584aa";
    const accessKeyId = "b5e6737789c7fd039bdfa05c106d8d85";
    const secretAccessKey = "c602368c495ff9f06cd4a5f861283a63115b652731ecddc742a8b664ad1d738b";
    const bucketName = "belavida-bucket";

    const client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true,
    });

    const corsCommand = new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                    AllowedOrigins: ["*"], // In production, this should be restricted to the specific origin.
                    ExposeHeaders: ["ETag"],
                    MaxAgeSeconds: 3600,
                },
            ],
        },
    });

    try {
        await client.send(corsCommand);
        console.log("CORS policy successfully set on R2 bucket!");
    } catch (err) {
        console.error("Error setting CORS policy:", err);
    }
}

setCors();
