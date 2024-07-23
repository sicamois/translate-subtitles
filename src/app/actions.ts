'use server';

import { exctractFCPXML, replaceSubtitlesInFCPXML } from '@/lib/fcpxmlParser';
import type { Subtitle } from '@/lib/fcpxmlParser';
import { XMLBuilder } from 'fast-xml-parser';
import fileContentToS3 from '@/lib/fileContentToS3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: 'eu-west-3' });

export async function createFcpxmlFile(
  fcpxmlFilename: string,
  translatedSubtitles: Subtitle[],
  language: string,
) {
  const xml = await exctractFCPXML(fcpxmlFilename);

  const translatedFcpxmlData = replaceSubtitlesInFCPXML(
    xml,
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
  const filenameParts = fcpxmlFilename.split('-');
  // Remove uuid prefix in file name
  filenameParts.shift();
  const filename = `${filenameParts.join('-').replace('.fcpxml', '')} (SUB ${language}).fcpxml`;

  try {
    await fileContentToS3(filename, cleanXmlDataStr);
  } catch (error) {
    throw new Error(`Unable to load file ${filename}`);
  }

  // Get a pre-signed URL to download the file.
  const getCommand = new GetObjectCommand({
    Bucket: 'translate-subtitles-app-uploads',
    Key: filename,
  });
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

  return { filename, url };
}
