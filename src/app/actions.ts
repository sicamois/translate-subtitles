'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/encryptionUtils';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Subtitle } from '@/lib/fcpxmlParser';
import { importExcelFile } from '@/lib/xlsxUtils';

export async function uploadFile(
  currentState: {
    message: string;
  },
  formData: FormData,
) {
  const s3Client = new S3Client({ region: 'eu-west-3' });

  const schema = z.object({
    file: z.instanceof(File),
  });
  const parse = schema.safeParse({
    file: formData.get('file'),
  });

  if (!parse.success) {
    console.error(parse.error);
    return {
      message: 'Unable to load file',
    };
  }

  const file = parse.data.file;
  let s3output: PutObjectCommandOutput;

  try {
    // Put an object into an Amazon S3 bucket.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.name,
      Body: buffer,
    });
    s3output = await s3Client.send(command);
  } catch (error) {
    console.error(error);
    return {
      message: `Unable to load file ${file.name}`,
    };
  }

  const encryptedFile = encrypt(file.name, process.env.KEY!);

  let languages: string[] = [];

  Array.from(formData).map(([key, value]) => {
    if (key !== 'file' && value === 'on') {
      languages.push(key);
    }
  });

  redirect(`/translate?file=${encryptedFile}&langs=${languages.join(',')}`);
}

export async function uploadTranslations(
  currentState: {
    translations?: Subtitle[];
    language?: string;
    message: string;
  },
  formData: FormData,
) {
  const file = formData.get('translation_file') as File;
  if (file.size === 0) {
    return {
      ...currentState,
      message: 'Aucun fichier sélectionné',
    };
  }

  try {
    const { translations, language } = await importExcelFile(file);
    return {
      message: '',
      translations,
      language,
    };
  } catch (error) {
    console.error(error);
    return {
      ...currentState,
      message: `Unable to load file ${file.name}`,
    };
  }
}
