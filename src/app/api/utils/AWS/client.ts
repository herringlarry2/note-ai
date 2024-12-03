import { S3Client } from "@aws-sdk/client-s3";

export const bucketName = "yorn-midi-prod"; // Your bucket name
export const region = "us-east-1"; // Your AWS region (e.g., "us-east-1")
const accessKeyId = process.env.AWS_ACCESS_KEY_ID; // From .env
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY; // From .env
// Create S3 client
export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId: accessKeyId ?? "",
        secretAccessKey: secretAccessKey ?? "",
    },
});
