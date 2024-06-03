import { decrypt } from '@/lib/utils';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { notFound } from 'next/navigation';
import { extractNameAndSubtitles } from '@/lib/fcpxmlParser';
import TranslateSubtitles from '@/components/TranslateSubtitles';
import { SuppportedLocale, getDictionary } from '@/app/dictionaries';
import { createZipFromSubtitles, uploadExcelFile } from '@/lib/xlsxUtils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';

export default async function ModifySubtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  const labelsDict = await getDictionary(lang);

  const s3Client = new S3Client({ region: 'eu-west-3' });

  const langsParam = searchParams.langs;
  if (!langsParam || typeof langsParam !== 'string') {
    notFound();
  }
  const langs = langsParam.split(',');

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

  const xlsxFilename = await createZipFromSubtitles(
    subtitles,
    videoTitle ?? filename,
    langs,
  );

  // Get a pre-signed URL to download the file.
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: xlsxFilename,
  });
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

  async function upload(formData: FormData) {
    'use server';
    const file = formData.get('translation_file') as File;
    if (file.size === 0) return;
    uploadExcelFile(file);
  }

  return (
    <main className="flex w-full flex-col items-center">
      <h1 className="p-6 text-center text-2xl font-thin drop-shadow-sm sm:text-4xl">
        {videoTitle}
      </h1>
      <h2 className="text-center text-xl font-thin italic drop-shadow-sm">
        {labelsDict.translate.translateSubtitles}
      </h2>
      <div className="flex gap-4">
        <Suspense fallback="Loading...">
          <Link
            className="m-auto"
            target="_blank"
            href={url}
            rel="noopener noreferrer"
            download={filename}
          >
            <Button className="pointer-events-auto m-8 h-10 bg-gradient-to-r from-pink-500 to-purple-600 p-2 px-4 text-lg transition-colors duration-100 ease-in-out hover:from-pink-600 hover:to-purple-700">
              <div className="flex items-center gap-1">
                <p className="font-medium drop-shadow">
                  {labelsDict.translate.downloadExcelZip}
                </p>
              </div>
            </Button>
          </Link>
        </Suspense>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="pointer-events-auto m-8 h-10 bg-gradient-to-r from-blue-600 to-emerald-500 p-2 px-4 text-lg transition-colors duration-100 ease-in-out hover:from-blue-700 hover:to-emerald-600">
              <div className="flex items-center gap-1">
                <p className="font-medium drop-shadow">
                  {labelsDict.translate.uploadTranslatedFile}
                </p>
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent asChild>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {labelsDict.translate.uploadTranslatedFile}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {labelsDict.translate.selectTranslationFile}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                type="file"
                id="translation_file"
                name="translation_file"
                accept=".xlsx"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>{labelsDict.file.cancel}</AlertDialogCancel>
                <AlertDialogAction type="submit" formAction={upload}>
                  {labelsDict.file.upload}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <TranslateSubtitles
        videoTitle={videoTitle || filename}
        subtitles={subtitles}
        labelsDict={labelsDict}
      />
    </main>
  );
}
