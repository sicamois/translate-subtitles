import { use } from 'react';
import { LabelsDictionary } from '@/app/dictionaries';
import { createZipFromSubtitles } from '@/lib/xlsxUtils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Subtitle } from '@/lib/fcpxmlParser';

export default function DownloadZipFilesButton(props: {
  labelsDict: LabelsDictionary;
  zipFilename: string;
  zipUrl: string;
  disabled?: boolean;
}) {
  return (
    <Link
      className="m-auto"
      target="_blank"
      href={props.zipUrl}
      rel="noopener noreferrer"
      download={props.zipFilename}
    >
      <Button
        className="pointer-events-auto bg-gradient-to-br from-pink-500 to-purple-600 text-lg transition-colors duration-100 ease-in-out hover:from-pink-600 hover:to-purple-700"
        size={'lg'}
        disabled={props.disabled}
      >
        <p className="font-semibold drop-shadow">
          {props.labelsDict.translate.downloadExcelZip}
        </p>
      </Button>
    </Link>
  );
}
