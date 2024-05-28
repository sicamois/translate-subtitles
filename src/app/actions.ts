'use server';

import { z } from 'zod';
import { permanentRedirect } from 'next/navigation';
import { encrypt } from '@/lib/utils';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadFile(
  currentState: {
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
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.name,
      Body: buffer,
    });
    s3output = await s3Client.send(command);
  } catch (e) {
    console.error(e);
    return { message: 'Erreur lors du téléchargement du fichier' };
  }

  const encryptedFile = encrypt(file.name, process.env.KEY!);

  permanentRedirect(`/modify-subtitles?file=${encryptedFile}`);
}

export async function createFile(
  currentState: { filename: string; url?: string; message: string },
  fromData: FormData
) {
  const s3Client = new S3Client({ region: 'eu-west-3' });

  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: currentState.filename,
    })
  );

  if (Body === undefined) {
    return {
      message: 'Impossible de lire le fichier ' + currentState.filename,
      filename: currentState.filename,
    };
  }

  let xmlData = await Body.transformToString();

  // Change the language of the subtitles
  // role="SUB ENG.SUB ENG-[0-9]*" -> role="SUB FRE.SUB FRE-[0-9]*"
  const regex = new RegExp('role="SUB ENG.SUB ENG-[0-9]*"', 'g');
  xmlData = xmlData.replace(
    regex,
    `role="SUB ${fromData.get('language')}.SUB ${fromData.get('language')}-1"`
  );
  const regexLanguage = '<languageCode>(?<language>[^<]*)</languageCode>';
  const matchLanguage = xmlData.match(new RegExp(regexLanguage));
  const language = matchLanguage?.groups?.language;
  if (language) {
    xmlData = xmlData.replace(
      new RegExp(regexLanguage, 'g'),
      `<languageCode>${fromData.get('language')}</languageCode>`
    );
  }

  // Replace the subtitles in the XML file
  Array.from(fromData.entries()).forEach(([key, value]) => {
    const regex = new RegExp(
      `<text>\n[ ]*<text-style ref="${key}">.*</text-style>\n[ ]*</text>`,
      'g'
    );
    xmlData = xmlData.replace(
      regex,
      `<text>\n                            <text-style ref="${key}">${value}</text-style>\n                        </text>`
    );
  });

  const generatedFilename = `generated/${currentState.filename}`.replace(
    '.fcpxml',
    '-modified.fcpxml'
  );
  console.log('generatedFilename', generatedFilename);

  try {
    // Put an object into an Amazon S3 bucket.
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: generatedFilename,
      Body: xmlData,
    });
    await s3Client.send(putCommand);

    // Get a pre-signed URL to download the file.
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: generatedFilename,
    });
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

    return {
      filename: generatedFilename,
      url,
      message: 'Le nouveau fichier a été créé avec succès',
    };
  } catch (e) {
    console.error(e);
    return {
      message: `Erreur lors de la création du nouveau fichier (${e})`,
      filename: currentState.filename,
    };
  }
}
