import { getDictionary } from '../dictionaries';
import type { SuppportedLocale } from '@/app/dictionaries';

import { UploadFile } from '@/components/UploadFile';

export default async function Home({
  params: { lang },
}: {
  params: { lang: SuppportedLocale };
}) {
  const labelsDict = await getDictionary(lang); // en
  return (
    <main className="m-auto p-8 pt-0 sm:mt-48">
      <UploadFile labelsDict={labelsDict} />
    </main>
  );
}
