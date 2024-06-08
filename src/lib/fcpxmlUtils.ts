import 'server-only';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { notFound } from 'next/navigation';
import { extractNameAndSubtitles } from './fcpxmlParser';
import { createZipFromSubtitles } from './xlsxUtils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fileContentFromS3 from './fileContentFromS3';

export async function exctractFCPXMLInfosAndUrl(
  filename: string,
  langs: string[],
) {
  const s3Client = new S3Client({ region: 'eu-west-3' });
  try {
    const fcpxmlData = await fileContentFromS3(filename);
    const [videoTitle, subtitles] = extractNameAndSubtitles(fcpxmlData);

    const zipFilename = await createZipFromSubtitles(
      subtitles,
      videoTitle ?? filename,
      langs,
    );

    // Get a pre-signed URL to download the file.
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: zipFilename,
    });
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

    return { videoTitle, subtitles, url, zipFilename };
  } catch (e) {
    console.error(e);
    notFound();
  }
}
