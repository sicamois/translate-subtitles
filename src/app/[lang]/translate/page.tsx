import { decrypt } from '@/lib/utils';
import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { notFound } from 'next/navigation';
import { Subtitle, extractNameAndSubtitles } from '@/lib/fcpxmlParser';
import TranslateSubtitles from '@/components/TranslateSubtitles';
import { SuppportedLocale, getDictionary } from '@/app/dictionaries';
import { Workbook } from 'exceljs';
import { createXlsxFromSubtitles } from '@/lib/xlsxUtils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

export default async function ModifySubtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  const labelsDict = await getDictionary(lang);

  const s3Client = new S3Client({ region: 'eu-west-3' });
  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }
  const filename = decrypt(encryptedFilename, process.env.KEY!);
  // Read the object.
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
  });

  let fcpxmlData: string;

  try {
    const { Body } = await s3Client.send(command);
    if (Body === undefined) {
      console.error('Impossible de lire le fichier ' + filename);
      notFound();
    }
    fcpxmlData = await Body.transformToString();
  } catch (e) {
    console.error(e);
    notFound();
  }

  const [videoTitle, subtitles] = extractNameAndSubtitles(fcpxmlData);

  const xlsxFilename = await createXlsxFromSubtitles(
    subtitles,
    videoTitle ?? filename,
    'FRE'
  );

  // Get a pre-signed URL to download the file.
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: xlsxFilename,
  });
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

  const translations = subtitles.map((subtitle) => {
    return subtitle.titles
      .map((title) =>
        title.highlighted
          ? `<span class='text-red-500'>${title.text}</span>`
          : title.text
      )
      .join(' ');
  });

  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-center text-4xl font-thin drop-shadow-sm mb-4'>
        {videoTitle}
      </h1>
      <h2 className='text-center text-xl italic font-thin drop-shadow-sm mb-2'>
        {labelsDict.translate.translateSubtitles}
      </h2>
      <Suspense fallback='Loading...'>
        <Link
          className='m-auto'
          target='_blank'
          href={url}
          rel='noopener noreferrer'
          download={filename}
        >
          <Button className='m-8 h-10 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-2 px-4 transition-colors duration-100 ease-in-out pointer-events-auto'>
            <div className='flex gap-1 items-center'>
              <p className='font-medium drop-shadow'>
                {labelsDict.translate.downloadExcel}
              </p>
            </div>
          </Button>
        </Link>
      </Suspense>
      <TranslateSubtitles
        videoTitle={videoTitle || filename}
        subtitles={subtitles}
        translations={translations}
        labelsDict={labelsDict}
      />
    </div>
  );
}
