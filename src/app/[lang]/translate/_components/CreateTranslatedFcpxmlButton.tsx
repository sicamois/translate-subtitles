import { useTransition, useCallback } from 'react';
import { Subtitle } from '@/lib/fcpxmlParser';
import { createFcpxmlFile } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';

type CreateTranslatedFcpxmlButtonProps = {
  fcpxmlFilename: string;
  translatedSubtitles: Subtitle[];
  language: string;
  label: string;
};

export default function CreateTranslatedFcpxmlButton({
  fcpxmlFilename,
  translatedSubtitles,
  language,
  label,
}: CreateTranslatedFcpxmlButtonProps) {
  const [isPending, startTransition] = useTransition();

  const downloadFile = useCallback(async (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleCreateFile = useCallback(() => {
    startTransition(async () => {
      try {
        const { filename, url } = await createFcpxmlFile(
          fcpxmlFilename,
          translatedSubtitles,
          language,
        );
        await downloadFile(url, filename);
      } catch (error) {
        console.error('Error creating FCPXML file:', error);
        // You might want to add error handling here, e.g., showing a toast notification
      }
    });
  }, [fcpxmlFilename, translatedSubtitles, language, downloadFile]);

  return (
    <Button
      className="flex gap-2 text-lg"
      size="lg"
      onMouseDown={handleCreateFile}
      disabled={isPending}
    >
      {isPending && <Spinner />}
      <span>{label}</span>
    </Button>
  );
}
