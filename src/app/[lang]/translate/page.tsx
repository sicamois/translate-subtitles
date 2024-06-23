import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryptionUtils';
import { exctractFCPXML } from '@/lib/fcpxmlUtils';
import { getDictionary } from '@/app/dictionaries';
import type { SuppportedLocale } from '@/app/dictionaries';
import Title from '@/app/_components/Title';
import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export default async function Subtitles({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { lang: SuppportedLocale };
}) {
  // It is inexpensive, so we can await it
  // const labelsDict = await getDictionary(lang);

  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }
  const filename = decrypt(encryptedFilename);

  const fcpxml = exctractFCPXML(filename);

  return (
    <main className="flex w-full flex-col items-center gap-6 pb-20">
      <section className="flex flex-col items-center gap-2">
        <div className="mt-8 h-16">
          <Suspense fallback={<Spinner className="h-10 w-10" />}>
            <Title fcpxml={fcpxml} />
          </Suspense>
        </div>
        {/* <h2 className="text-center text-xl font-extralight drop-shadow-sm">
          {labelsDict.translate.translateSubtitles}
        </h2> */}
      </section>
    </main>
  );
}
