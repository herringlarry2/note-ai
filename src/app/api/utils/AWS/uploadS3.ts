import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, bucketName } from './client'

export async function uploadS3(file: Uint8Array, fileName: string) {
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
    }

    const command = new PutObjectCommand(uploadParams)
    await s3Client.send(command)
}
