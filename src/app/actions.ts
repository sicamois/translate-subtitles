'use server';

import { z } from 'zod';
import { permanentRedirect } from 'next/navigation';
import { encrypt } from '@/lib/utils';

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

export async function uploadFile(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const s3Client = new S3Client({ region: 'eu-west-3' });

  const schema = z.object({
    file: z.instanceof(File),
  });
  const parse = schema.safeParse({
    file: formData.get('file'),
  });

  if (!parse.success) {
    return { message: 'Erreur lors de la récupération du fichier' };
  }

  const file = parse.data.file;
  let s3output: PutObjectCommandOutput;

  try {
    // Put an object into an Amazon S3 bucket.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    s3output = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.name,
        Body: buffer,
      })
    );
  } catch (e) {
    console.error(e);
    return { message: 'Erreur lors du téléchargement du fichier' };
  }

  const encryptedFile = encrypt(file.name, process.env.KEY!);

  permanentRedirect(`/modify-subtitles?file=${encryptedFile}`);
}
