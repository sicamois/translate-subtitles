import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type DownloadFileButtonInfos = {
  href: string;
  filename: string;
  label: string;
};

export default function DownloadFileButton({
  href,
  filename,
  label,
  className,
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
          'pointer-events-auto m-8 h-10 bg-gradient-to-r from-pink-500 to-purple-600 p-2 px-4 text-lg transition-colors duration-100 ease-in-out hover:from-pink-600 hover:to-purple-700',
          className,
        )}
      >
        <div className="flex items-center gap-1">
          <p className="font-medium drop-shadow">{label}</p>
        </div>
      </Button>
    </Link>
  );
}
