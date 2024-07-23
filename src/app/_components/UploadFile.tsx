'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadToS3 } from 'use-upload-to-s3';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/Spinner';
import { Switch } from '@/components/ui/switch';
import { LabelsDictionary } from '@/app/dictionaries';
import { encrypt } from '@/lib/encryptionUtils';

const SUPPORTED_LANGUAGES = ['FRA', 'ESP', 'ARA', 'ITA', 'RUS'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

interface UploadFileProps {
  labelsDict: LabelsDictionary;
}

export function UploadFile({ labelsDict }: UploadFileProps) {
  const router = useRouter();
  const [languages, setLanguages] = useState<SupportedLanguage[]>([
    'FRA',
    'ESP',
    'ARA',
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [handleInputChange, s3key, isPending, error] = useUploadToS3(
    'translate-subtitles-app-uploads',
    {
      accept: '.fcpxml',
      sizeLimit: '50mb',
      async onUploadComplete(s3key) {
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
    if (error) setIsLoading(false);
  }, [error]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      handleInputChange(event);
    }
  };

  const toggleLanguage = (lang: SupportedLanguage, checked: boolean) => {
    setLanguages((prev) =>
      checked ? [...prev, lang] : prev.filter((l) => l !== lang),
    );
  };

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
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>
      <ul className="flex items-center gap-6">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <LanguageToggle
            key={lang}
            lang={lang}
            checked={languages.includes(lang)}
            disabled={isLoading}
            onChange={toggleLanguage}
          />
        ))}
      </ul>
      {isLoading ? (
        <LoadingIndicator label={labelsDict.file.uploading} />
      ) : null}
      {error ? <ErrorMessage message={error.message} /> : null}
    </form>
  );
}

interface LanguageToggleProps {
  lang: SupportedLanguage;
  checked: boolean;
  disabled: boolean;
  onChange: (lang: SupportedLanguage, checked: boolean) => void;
}

function LanguageToggle({
  lang,
  checked,
  disabled,
  onChange,
}: LanguageToggleProps) {
  return (
    <li className="flex flex-col items-center">
      <label htmlFor={lang}>{lang}</label>
      <Switch
        id={lang}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(checked) => onChange(lang, checked)}
      />
    </li>
  );
}

function LoadingIndicator({ label }: { label: string }) {
  return (
    <div className="flex h-8 items-center justify-center gap-2 text-lg">
      <Spinner />
      <p>{label}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-center font-light text-red-600">Error: {message}</p>
  );
}
