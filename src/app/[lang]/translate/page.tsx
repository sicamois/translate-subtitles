import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryptionUtils';
import { getDictionary } from '@/app/dictionaries';
import type { SuppportedLocale } from '@/app/dictionaries';
import VideoTitle from '@/app/_components/VideoTitle';
import SubtitlesView from '@/app/_components/SubtitlesView';
import { extractSubtitles, extractVideoTitle } from '@/lib/fcpxmlParser';
import { createZipFromSubtitles } from '@/lib/xlsxUtils';

export default async function Subtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }

  const langsParam = searchParams.langs;
  if (!langsParam || typeof langsParam !== 'string') {
    notFound();
  }
  const langs = langsParam.split(',');

  const filename = await decrypt(encryptedFilename);
  console.log('filename', filename);
  const videoTitle = await extractVideoTitle(filename);
  const subtitles = await extractSubtitles(filename);
  const { url, zipFilename } = await createZipFromSubtitles(
    subtitles,
    videoTitle,
    langs,
  );
  const labelsDict = await getDictionary(lang);

  return (
    <main className="flex w-full flex-col items-center gap-6 pb-20">
      <VideoTitle labelsDict={labelsDict} videoTitle={videoTitle} />
      <SubtitlesView
        filename={filename}
        labelsDict={labelsDict}
        subtitles={subtitles}
        videoTitle={videoTitle}
        zipFilename={zipFilename}
        zipUrl={url}
        langs={langs}
      />
    </main>
  );
}
