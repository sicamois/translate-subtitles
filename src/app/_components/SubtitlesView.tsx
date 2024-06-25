'use client';

import { useState } from 'react';
import { LabelsDictionary } from '../dictionaries';
import DownloadZipFilesButton from './DownloadZipFilesButton';
import UploadFileAlert from './UploadFileAlert';
import { Subtitle } from '@/lib/fcpxmlParser';
import SubtitlesTable from './SubtitlesTable';
import CreateTranslatedFcpxmlButton from './CreateTranslatedFcpxmlButton';

export default function SubtitlesView(props: {
  filename: string;
  subtitles: Subtitle[];
  videoTitle: string;
  labelsDict: LabelsDictionary;
  zipFilename: string;
  zipUrl: string;
  langs: string[];
  disabled?: boolean;
}) {
  const [translatedSubtitles, setTranslatedSubtitles] = useState<
    Subtitle[] | undefined
  >(undefined);
  const [language, setLanguage] = useState<string>();

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex justify-center gap-4">
        <DownloadZipFilesButton
          labelsDict={props.labelsDict}
          zipFilename={props.zipFilename}
          zipUrl={props.zipUrl}
        />
        <UploadFileAlert
          subtitlesCount={props.subtitles.length ?? 0}
          setTranslatedSubtitles={setTranslatedSubtitles}
          setLanguage={setLanguage}
          labelsDict={props.labelsDict}
        />
      </div>
      <SubtitlesTable
        originalSubtitles={props.subtitles}
        translatedSubtitles={translatedSubtitles}
        language={language}
      />
      {translatedSubtitles && language ? (
        <CreateTranslatedFcpxmlButton
          fcpxmlFilename={props.filename}
          translatedSubtitles={translatedSubtitles}
          language={language}
          label={props.labelsDict.translate.createTranslatedFcpxml}
        />
      ) : null}
    </div>
  );
}
