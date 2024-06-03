'use client';

import { useFormState } from 'react-dom';
import { uploadTranslations } from '@/app/actions';
import type { Subtitle } from '@/lib/fcpxmlParser';
import UploadFileAlert, { UploadFileAlertLabels } from './UploadFileAlert';
import DownloadFileButton, {
  DownloadFileButtonInfos,
} from './DownloadFileButton';
import SubtitlesTable from './SubtitlesTable';
import { toast } from 'sonner';
import { useEffect } from 'react';

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
    originalSubtitles: Subtitle[];
    translatedSubtitles?: Subtitle[];
    language?: string;
    message: string;
    finished: boolean;
  } = {
    originalSubtitles: subtitles,
    message: '',
    finished: false,
  };
  const [state, formAction] = useFormState(uploadTranslations, initialState);
  const { message, originalSubtitles, translatedSubtitles, language } = state;

  // We put the toast in a useEffect to avoid the SSR error
  useEffect(() => {
    if (
      translatedSubtitles !== undefined &&
      translatedSubtitles.length !== subtitles.length
    ) {
      toast(
        <article className="text-red-500">
          <h3 className="mb-2 rounded font-bold underline">
            Wrong number of subtitles in the Excel file
          </h3>
          <p>
            There are <strong>{subtitles.length}</strong> subtitles in the Final
            Cut Pro file and <strong>{translatedSubtitles.length}</strong>{' '}
            translated subtitles in the Excel file`
          </p>
        </article>,
      );
    }
  }, [translatedSubtitles, subtitles]);

  let validatedTranslatedSubtitles: Subtitle[] | undefined;
  let validatedLanguage: string | undefined;
  if (translatedSubtitles?.length === subtitles.length) {
    validatedTranslatedSubtitles = translatedSubtitles;
    validatedLanguage = language;
  }

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
        translatedSubtitles={validatedTranslatedSubtitles}
        language={validatedLanguage}
      />
    </div>
  );
}
