'use client';

import { useActionState, useState } from 'react';
import { uploadTranslations, createFcpxmlFile } from '@/app/actions';
import type { Subtitle } from '@/lib/fcpxmlParser';
import UploadFileAlert, { UploadFileAlertLabels } from './UploadFileAlert';
import DownloadFileButton, {
  DownloadFileButtonInfos,
} from './DownloadFileButton';
import SubtitlesTable from './SubtitlesTable';
import { toast } from 'sonner';
import { useEffect } from 'react';
import ToastContent from './ToastContent';
import { Button } from './ui/button';
import CreateTranslatedFcpxmlButton from './CreateTranslatedFcpxmlButton';

export const languages = {
  FRA: 'Français',
  ESP: 'Español',
  ARA: 'Arabic',
  ITA: 'Italiano',
  RUS: 'Russkiy',
} as const;

export type AcceptedLanguages = keyof typeof languages;

export default function TranslateSubtitles({
  fcpxmlFilename,
  subtitles,
  downloadFileInfos,
  uploadLabels,
  createTranslatedFcpxmlLabel,
}: {
  fcpxmlFilename: string;
  subtitles: Subtitle[];
  downloadFileInfos: DownloadFileButtonInfos;
  uploadLabels: UploadFileAlertLabels;
  createTranslatedFcpxmlLabel: string;
}) {
  const uploadTranslationInitialState: {
    translatedSubtitles?: Subtitle[];
    language?: string;
    message: string;
  } = {
    message: '',
  };
  const [
    uploadTranslationsState,
    uploadTranslationsFormAction,
    isuploadTranslationsPending,
  ] = useActionState(uploadTranslations, uploadTranslationInitialState);

  const [translatedSubtitles, setTranslatedSubtitles] = useState<Subtitle[]>();
  const [language, setLanguage] = useState<string>();

  useEffect(() => {
    const translations = uploadTranslationsState.translatedSubtitles;
    const language = uploadTranslationsState.language;

    if (uploadTranslationsState.message !== '') {
      toast(
        ToastContent(
          'Problem importing Excel file',
          uploadTranslationsState.message,
        ),
      );
    } else if (translations && translations.length !== subtitles.length) {
      setTranslatedSubtitles(undefined);
      setLanguage(undefined);
      toast(
        ToastContent(
          'Wrong number of subtitles in the Excel file',
          `There are ${subtitles.length} subtitles in the Final Cut Pro file and ${translations?.length || 0} translated subtitles in the Excel file`,
        ),
      );
    } else {
      setTranslatedSubtitles(translations);
      setLanguage(language);
    }
  }, [uploadTranslationsState, subtitles]);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <section className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        <DownloadFileButton
          href={downloadFileInfos.href}
          filename={downloadFileInfos.filename}
          label={downloadFileInfos.label}
          disabled={isuploadTranslationsPending}
        />
        <UploadFileAlert
          labels={uploadLabels}
          formAction={uploadTranslationsFormAction}
          isPending={isuploadTranslationsPending}
        />
      </section>
      <SubtitlesTable
        originalSubtitles={subtitles}
        translatedSubtitles={translatedSubtitles}
        language={language}
      />
      {translatedSubtitles && language ? (
        <CreateTranslatedFcpxmlButton
          fcpxmlFilename={fcpxmlFilename}
          translatedSubtitles={translatedSubtitles}
          language={language}
          label={createTranslatedFcpxmlLabel}
        />
      ) : null}
    </div>
  );
}
