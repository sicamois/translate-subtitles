'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/Spinner';
import { LabelsDictionary } from '@/app/dictionaries';
import { useUploadToS3 } from '@sicamois/use-upload-to-s3';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { encrypt } from '@/lib/encryptionUtils';

const supportedLanguages = ['FRA', 'ESP', 'ARA', 'ITA', 'RUS'] as const;

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const router = useRouter();
  const [languages, setLanguages] = useState<
    (typeof supportedLanguages)[number][]
  >(['FRA', 'ESP', 'ARA']);
  const [isLoading, setIsLoading] = useState(false);

  const [handleInputChange, s3key, isPending, error] = useUploadToS3(
    'translate-subtitles-app-uploads',
    'eu-west-3',
    {
      accept: '.fcpxml',
      sizeLimit: 50 * 1024 * 1024,
      onUploadStart: () => {
        setIsLoading(true),
          toast.info('Uploading...', {
            id: 'toast-uploading',
            duration: 100000,
          });
      },
      async onUploadComplete(s3key) {
        // It's inexpensive, so we can await it
        const encryptedFilename = await encrypt(s3key);
        router.push(
          `/translate?file=${encryptedFilename}&langs=${languages.join(',')}`,
        );
        toast.dismiss('toast-uploading');
        toast.success('Upload complete');
        setIsLoading(false);
      },
    },
  );

  useEffect(() => {
    if (error !== null) {
      setIsLoading(false);
    }
  }, [error]);

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
          disabled={isLoading}
        />
      </div>
      <ul className="flex items-center gap-6">
        {supportedLanguages.map((lang) => (
          <li key={lang} className="flex flex-col items-center">
            <label htmlFor={lang}>{lang}</label>
            <Switch
              id={lang}
              checked={languages.includes(lang)}
              disabled={isLoading}
              onCheckedChange={(checked) =>
                setLanguages((prev) =>
                  checked ? [...prev, lang] : prev.filter((l) => l !== lang),
                )
              }
            />
          </li>
        ))}
      </ul>
      {isLoading ? (
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
