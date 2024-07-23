import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Subtitle } from '@/lib/fcpxmlParser';

interface SubtitlesTableProps {
  originalSubtitles: Subtitle[];
  translatedSubtitles?: Subtitle[];
  language?: string;
}

export default function SubtitlesTable({
  originalSubtitles,
  translatedSubtitles,
  language,
}: SubtitlesTableProps) {
  const headers = ['Ref', 'Subtitle', ...(language ? [language] : [])];

  const subtitleTableData = originalSubtitles.map((subtitle, index) => [
    subtitle,
    translatedSubtitles?.[index],
  ]);

  return (
    <Table className="m-auto w-fit overflow-hidden">
      <TableHeader className="bg-primary text-lg font-medium text-primary-foreground">
        <TableRow>
          {headers.map((header, index) => (
            <TableHead
              key={header}
              className={cn(
                'font-medium drop-shadow',
                index === 0 && 'rounded-s-md',
                index === headers.length - 1 && 'rounded-e-md',
              )}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {subtitleTableData.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            className="divide-x divide-dashed divide-muted py-2"
          >
            <TableCell className="py-2">
              <p>{rowIndex + 1}</p>
            </TableCell>
            {row.map(
              (subtitle, colIndex) =>
                subtitle && (
                  <SubtitleCell
                    key={`${rowIndex}-${colIndex}`}
                    subtitle={subtitle}
                  />
                ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface SubtitleCellProps {
  subtitle: Subtitle;
}

function SubtitleCell({ subtitle }: SubtitleCellProps) {
  return (
    <TableCell className="w-[25rem] font-medium">
      <div className="flex flex-wrap justify-center gap-1 text-center">
        {subtitle.titles.map((title, index) => (
          <SubtitleText key={`${title.text}-${index}`} title={title} />
        ))}
      </div>
    </TableCell>
  );
}

interface SubtitleTextProps {
  title: { text: string; highlighted?: boolean };
}

function SubtitleText({ title }: SubtitleTextProps) {
  if (title.text === '§') {
    return <p className="w-full" />;
  }
  return (
    <p className={title.highlighted ? 'text-red-500' : undefined}>
      {title.text}
    </p>
  );
}
