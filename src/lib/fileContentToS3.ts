import 'server-only';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'eu-west-3' });

export async function fileToS3(s3key: string, file: File) {
  // Put an object into an Amazon S3 bucket.
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3key,
    Body: buffer,
  });

  await s3Client.send(command);
}

export default async function fileContentToS3(
  s3key: string,
  content: string | Buffer | Uint8Array | Blob | undefined,
) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3key,
    Body: content,
  });

  await s3Client.send(command);
}
