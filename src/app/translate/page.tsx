import { decrypt } from '@/lib/utils';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { notFound } from 'next/navigation';
import { extractNameAndSubtitles } from '@/lib/fcpxmlParser';
import TranslateSubtitles from '@/components/TranslateSubtitles';

export type Subtitle = {
  subtitle: string;
  ref: string;
};

export default async function ModifySubtitles({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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

  return (
    <div>
      <h1 className='text-center text-4xl font-thin drop-shadow-sm mb-4'>
        {videoTitle}
      </h1>
      <h2 className='text-center text-xl italic font-thin drop-shadow-sm mb-4'>
        Traduire les sous-titres
      </h2>
      <TranslateSubtitles
        filename={filename}
        videoTitle={videoTitle}
        subtitles={subtitles}
      />
    </div>
  );
}
