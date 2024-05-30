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
    <div className='h-screen'>
      <UploadFile labelsDict={labelsDict} />
    </div>
  );
}
