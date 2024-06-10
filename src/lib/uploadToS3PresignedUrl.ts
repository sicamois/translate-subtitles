'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadToS3PresignedUrl(file: File) {
  const s3Client = new S3Client({ region: process.env.AWS_S3_REGION });

  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new Error('Missing environment variable AWS_S3_BUCKET_NAME');
  }

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: file.name,
  });
  return await getSignedUrl(s3Client, putCommand, { expiresIn: 600 });
}
