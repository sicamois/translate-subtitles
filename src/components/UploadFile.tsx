'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import Spinner from './Spinner';
import { LabelsDictionary } from '@/app/dictionaries';
import { useUploadToS3 } from '@sicamois/use-upload-to-s3';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encrypt } from '@/lib/encryptionUtils';
import { Switch } from './ui/switch';

const supportedLanguages = ['FRA', 'ESP', 'ARA', 'ITA', 'RUS'] as const;

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const [languages, setLanguages] = useState<
    (typeof supportedLanguages)[number][]
  >(['FRA', 'ESP', 'ARA']);

  const [handleInputChange, s3key, isPending, error] = useUploadToS3(
    'translate-subtitles-app-uploads',
    'eu-west-3',
    {
      accept: '.fcpxml',
      sizeLimit: 50 * 1024 * 1024,
    },
  );
  const router = useRouter();
  useEffect(() => {
    if (!s3key) return;

    encrypt(s3key).then((encryptedFilename) =>
      router.push(
        `/translate?file=${encryptedFilename}&langs=${languages.join(',')}`,
      ),
    );
  }, [languages, router, s3key]);

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
          accept=".fcpxml"
          required
          onChange={handleInputChange}
          disabled={isPending}
        />
      </div>
      <ul className="flex items-center gap-6">
        {supportedLanguages.map((lang) => (
          <li key={lang} className="flex flex-col items-center">
            <label htmlFor={lang}>{lang}</label>
            <Switch
              id={lang}
              checked={languages.includes(lang)}
              onCheckedChange={(checked) =>
                setLanguages((prev) =>
                  checked ? [...prev, lang] : prev.filter((l) => l !== lang),
                )
              }
            />
          </li>
        ))}
      </ul>
      {isPending ? (
        <div className="flex h-8 items-center justify-center gap-2 text-lg">
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
