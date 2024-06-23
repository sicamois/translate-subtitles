import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryptionUtils';
import { exctractFCPXML } from '@/lib/fcpxmlUtils';
import { getDictionary } from '@/app/dictionaries';
import type { SuppportedLocale } from '@/app/dictionaries';
import VideoTitle from '@/app/_components/VideoTitle';
import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default async function Subtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  const labelsDictPromise = getDictionary(lang);

  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }
  const filenamePromise = decrypt(encryptedFilename);
  // const fcpxmlPromise = exctractFCPXML(filename);

  return (
    <main className="flex w-full flex-col items-center gap-6 pb-20">
      <div className="mt-8 h-20">
        <Suspense fallback={<Spinner className="h-10 w-10" />}>
          <VideoTitle
            labelsDictPromise={labelsDictPromise}
            filenamePromise={filenamePromise}
            // fcpxmlPromise={fcpxmlPromise}
          />
        </Suspense>
      </div>
    </main>
  );
}
