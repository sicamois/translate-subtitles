import { getDictionary } from '../dictionaries';
import type { SuppportedLocale } from '@/app/dictionaries';

import { fontFamily } from 'tailwindcss/defaultTheme';
import { UploadFile } from '@/components/UploadFile';

export default async function Home({
  params: { lang },
}: {
  params: { lang: SuppportedLocale };
}) {
  const labelsDict = await getDictionary(lang); // en
  console.log(fontFamily.sans);
  return (
    <main className="m-auto p-8 pt-0 sm:mt-48">
      <UploadFile labelsDict={labelsDict} />
    </main>
  );
}
