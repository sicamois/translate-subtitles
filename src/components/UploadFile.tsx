'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import Spinner from './Spinner';
import { LabelsDictionary } from '@/app/dictionaries';
import useUploadToS3 from '@/lib/useUploadToS3';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { encrypt } from '@/lib/encryptionUtils';

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const [handleInputChange, s3key, isPending, error] = useUploadToS3(
    'translate-subtitles-app-uploads',
    'eu-west-3',
  );
  const router = useRouter();
  useEffect(() => {
    if (!s3key) return;

    console.log('s3key: ', s3key);
    const encryptedFile = encrypt(s3key).then((encryptedFilename) =>
      router.push(`/translate?file=${encryptedFilename}&langs=FRA,ESP`),
    );
  }, [router, s3key]);

  return (
    <form className="m-auto flex flex-col items-center gap-4">
      <Label htmlFor="file" className="text-center">
        {labelsDict.file.selectFile}
      </Label>
      <div className="rounded-lg bg-gradient-to-l from-blue-600 to-emerald-500 p-[2px]">
        <Input
          className="h-24 cursor-pointer border-none p-9 text-lg text-primary"
          type="file"
          id="file"
          // accept=".fcpxml"
          required
          onChange={handleInputChange}
          disabled={isPending}
        />
      </div>
      {isPending ? (
        <div className="flex h-8 items-center gap-2 text-lg">
          <Spinner />
          <p>{labelsDict.file.uploading}</p>
        </div>
      ) : null}
      {error ? (
        <p className="text-center font-light text-red-600">
          Error: {error.message}
        </p>
      ) : null}
    </form>
  );
}
