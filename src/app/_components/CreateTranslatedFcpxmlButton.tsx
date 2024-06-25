import { Subtitle } from '@/lib/fcpxmlParser';
import { useTransition } from 'react';
import { createFcpxmlFile } from '@/app/actions';
import { Button } from '../../components/ui/button';
import Spinner from '../../components/ui/Spinner';

export default function CreateTranslatedFcpxmlButton({
  fcpxmlFilename,
  translatedSubtitles,
  language,
  label,
}: {
  fcpxmlFilename: string;
  translatedSubtitles: Subtitle[];
  language: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  const onMouseDown = () => {
    startTransition(async () => {
      const { filename, url } = await createFcpxmlFile(
        fcpxmlFilename,
        translatedSubtitles,
        language,
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button
      className="flex gap-2 text-lg"
      size={'lg'}
      onMouseDown={onMouseDown}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : null}
      <p>{label}</p>
    </Button>
  );
}
