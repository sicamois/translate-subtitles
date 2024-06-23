import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useUploadToS3 } from '@sicamois/use-upload-to-s3';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Subtitle } from '@/lib/fcpxmlParser';
import { importExcelFile } from '@/lib/xlsxUtils';

export type UploadFileAlertLabels = {
  alertTrigger: string;
  alertTitle: string;
  alertDescription: string;
  action: string;
  cancel: string;
};

export default function UploadFileAlert({
  subtitlesCount,
  setTranslatedSubtitles,
  setLanguage,
  labels,
}: {
  subtitlesCount: number;
  setTranslatedSubtitles: (
    value: SetStateAction<Subtitle[] | undefined>,
  ) => void;
  setLanguage: Dispatch<SetStateAction<string | undefined>>;
  labels: UploadFileAlertLabels;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [handleInputChange, s3key, isUploading, uploadError] = useUploadToS3(
    'translate-subtitles-app-uploads',
    'eu-west-3',
    {
      accept: '.xlsx',
      sizeLimit: 50 * 1024 * 1024,
    },
  );

  useEffect(() => {
    setError(null);
    if (!s3key) return;
    startTransition(() => {
      const file = inputFileRef.current?.files?.[0];
      if (!file) return;
      importExcelFile(file)
        .then(({ translations, language }) => {
          if (translations.length !== subtitlesCount) {
            throw new Error(
              `The number of translations in the file does not match the number of subtitles (${translations.length} in Excel file vs ${subtitlesCount} in Final Cut Pro)`,
            );
          }
          setTranslatedSubtitles(translations);
          setLanguage(language);
          setOpen(false);
        })
        .catch((error) => {
          setError(error);
        });
    });
  }, [s3key, setLanguage, setTranslatedSubtitles, subtitlesCount]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open: boolean) => {
        setError(null);
        setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          className="pointer-events-auto bg-gradient-to-br from-blue-600 to-emerald-500 text-lg transition-colors duration-100 ease-in-out hover:from-blue-700 hover:to-emerald-600"
          size={'lg'}
          disabled={isPending}
        >
          <p className="font-semibold drop-shadow">{labels.alertTrigger}</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <form>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.alertDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-gradient-to-tl from-blue-600 to-emerald-500 p-[2px]">
              <Input
                className="h-24 cursor-pointer border-none p-9 text-lg text-primary"
                type="file"
                id="translation_file"
                accept=".xlsx"
                required
                disabled={isUploading || isPending}
                onChange={handleInputChange}
                ref={inputFileRef}
              />
            </div>
            {error || uploadError ? (
              <p className="text-center font-light text-red-500">
                Error - {error?.message || uploadError?.message}
              </p>
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
