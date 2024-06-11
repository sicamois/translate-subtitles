'use client';

import { useState } from 'react';
import type { Subtitle } from '@/lib/fcpxmlParser';
import UploadFileAlert, { UploadFileAlertLabels } from './UploadFileAlert';
import DownloadFileButton, {
  DownloadFileButtonInfos,
} from './DownloadFileButton';
import SubtitlesTable from './SubtitlesTable';
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
  const [translatedSubtitles, setTranslatedSubtitles] = useState<Subtitle[]>();
  const [language, setLanguage] = useState<string>();

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <section className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        <DownloadFileButton
          href={downloadFileInfos.href}
          filename={downloadFileInfos.filename}
          label={downloadFileInfos.label}
        />
        <UploadFileAlert
          subtitlesCount={subtitles.length}
          setTranslatedSubtitles={setTranslatedSubtitles}
          setLanguage={setLanguage}
          labels={uploadLabels}
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
