'use client';

import { use, useActionState, useState } from 'react';
import { uploadTranslations } from '@/app/actions';
import type { Subtitle } from '@/lib/fcpxmlParser';
import UploadFileAlert, { UploadFileAlertLabels } from './UploadFileAlert';
import DownloadFileButton, {
  DownloadFileButtonInfos,
} from './DownloadFileButton';
import SubtitlesTable from './SubtitlesTable';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { set } from 'zod';
import ToastContent from './ToastContent';

export const languages = {
  FRA: 'Français',
  ESP: 'Español',
  ARA: 'Arabic',
  ITA: 'Italiano',
  RUS: 'Russkiy',
} as const;

export type AcceptedLanguages = keyof typeof languages;

export default function TranslateSubtitles({
  subtitles,
  downloadFileInfos,
  uploadLabels,
}: {
  subtitles: Subtitle[];
  downloadFileInfos: DownloadFileButtonInfos;
  uploadLabels: UploadFileAlertLabels;
}) {
  const initialState: {
    translations?: Subtitle[];
    language?: string;
    message: string;
  } = {
    message: '',
  };
  const [state, formAction] = useActionState(uploadTranslations, initialState);
  const [translatedSubtitles, setTranslatedSubtitles] = useState<Subtitle[]>();
  const [language, setLanguage] = useState<string>();

  useEffect(() => {
    const translations = state.translations;
    if (state.message !== '') {
      toast(ToastContent('Problem importing Excel file', state.message));
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
      setLanguage(state.language);
    }
  }, [state, subtitles]);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <section className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        <DownloadFileButton
          href={downloadFileInfos.href}
          filename={downloadFileInfos.filename}
          label={downloadFileInfos.label}
        />
        <UploadFileAlert labels={uploadLabels} formAction={formAction} />
      </section>
      <SubtitlesTable
        originalSubtitles={subtitles}
        translatedSubtitles={translatedSubtitles}
        language={language}
      />
    </div>
  );
}
