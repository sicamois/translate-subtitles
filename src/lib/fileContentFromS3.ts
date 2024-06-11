import 'server-only';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { cache } from 'react';

const s3Client = new S3Client({ region: 'eu-west-3' });

async function fileContentFromS3(s3key: string) {
  // Read the object.
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3key,
  });

  const { Body } = await s3Client.send(command);
  if (Body === undefined) {
    throw new Error('Impossible de lire le fichier ' + s3key);
  }

  return await Body.transformToString();
}

export default cache(fileContentFromS3);
