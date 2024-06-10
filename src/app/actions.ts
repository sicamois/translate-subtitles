'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/encryptionUtils';
import { extractFcpxml, replaceSubtitlesInFCPXML } from '@/lib/fcpxmlParser';
import type { Subtitle } from '@/lib/fcpxmlParser';
import { importExcelFile } from '@/lib/xlsxUtils';
import fileContentFromS3 from '@/lib/fileContentFromS3';
import { XMLBuilder } from 'fast-xml-parser';
import fileContentToS3, { fileToS3 } from '@/lib/fileContentToS3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadFile(
  currentState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    file: z.instanceof(File).refine((file) => file.name.endsWith('.fcpxml'), {
      message: 'Le fichier doit être un fichier .fcpxml',
    }),
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

  try {
    await fileToS3(file.name, file);
  } catch (error) {
    console.error(error);
    return {
      message: `Unable to load file ${file.name}`,
    };
  }

  const encryptedFile = encrypt(file.name);

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
    translatedSubtitles?: Subtitle[];
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
      translatedSubtitles: translations,
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

export async function createFcpxmlFile(
  fcpxmlFilename: string,
  translatedSubtitles: Subtitle[],
  language: string,
) {
  const fcpxmlData = await fileContentFromS3(fcpxmlFilename);
  const fcpxml = extractFcpxml(fcpxmlData);

  const translatedFcpxmlData = replaceSubtitlesInFCPXML(
    fcpxml,
    translatedSubtitles,
  );

  const options = {
    ignoreAttributes: false,
    format: true,
  };

  const builder = new XMLBuilder(options);
  const xmlDataStr = builder.build(translatedFcpxmlData);
  const xmlDataStrWithDocType = xmlDataStr.replace(
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n',
  );
  const cleanXmlDataStr = xmlDataStrWithDocType.replace(/&apos;/g, "'");

  const filename = `${fcpxmlFilename.replace('.fcpxml', '')} (SUB ${language}).fcpxml`;

  try {
    await fileContentToS3(filename, cleanXmlDataStr);
  } catch (error) {
    throw new Error(`Unable to load file ${filename}`);
  }

  const s3Client = new S3Client({ region: 'eu-west-3' });

  // Get a pre-signed URL to download the file.
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
  });
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

  return { filename, url };
}
