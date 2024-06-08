import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type DownloadFileButtonInfos = {
  href: string;
  filename: string;
  label: string;
  disabled?: boolean;
};

export default function DownloadFileButton({
  href,
  filename,
  label,
  className,
  disabled,
}: DownloadFileButtonInfos & {
  className?: string;
}) {
  return (
    <Link
      className="m-auto"
      target="_blank"
      href={href}
      rel="noopener noreferrer"
      download={filename}
    >
      <Button
        className={cn(
          'pointer-events-auto bg-gradient-to-br from-pink-500 to-purple-600 text-lg transition-colors duration-100 ease-in-out hover:from-pink-600 hover:to-purple-700',
          className,
        )}
        size={'lg'}
        disabled={disabled}
      >
        <p className="font-semibold drop-shadow">{label}</p>
      </Button>
    </Link>
  );
}
