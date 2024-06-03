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

export default function SubtitlesTable({
  originalSubtitles,
  translatedSubtitles,
  language,
}: {
  originalSubtitles: Subtitle[];
  translatedSubtitles?: Subtitle[];
  language?: string;
}) {
  let headers = ['Ref', 'Subtitle'];
  if (language) {
    headers.push(language);
  }
  console.log('headers', headers);

  const subtitleTableData: [Subtitle, Subtitle | undefined][] =
    originalSubtitles.map((subtitle, index) => [
      subtitle,
      translatedSubtitles ? translatedSubtitles[index] : undefined,
    ]);

  const titleToParagraph = (title: { text: string; highlighted: boolean }) =>
    title.highlighted ? (
      <p className="text-red-500">{title.text}</p>
    ) : (
      <p>{title.text}</p>
    );

  return (
    <Table className="m-auto w-fit overflow-hidden">
      <TableHeader className="bg-primary text-lg font-medium text-primary-foreground">
        <TableRow>
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className={cn(
                'w-6',
                index === 0 ? 'rounded-s-md' : 0,
                index === headers.length - 1 ? 'rounded-e-md' : '',
              )}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {subtitleTableData.map((subtitleTableRowData, index) => (
          <TableRow key={index} className="py-2">
            <TableCell className="w-6 py-2">
              <p>{index + 1}</p>
            </TableCell>
            {subtitleTableRowData.map((subtitle, subindex) =>
              subtitle ? (
                <TableCell
                  key={`${index}-${subindex}`}
                  className="w-[24rem] font-medium"
                >
                  <div className="flex flex-wrap gap-1">
                    {subtitle.titles.map((title) =>
                      title.highlighted ? (
                        <p key={title.text} className="text-red-500">
                          {title.text}
                        </p>
                      ) : (
                        <p key={title.text}>{title.text}</p>
                      ),
                    )}
                  </div>
                </TableCell>
              ) : null,
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
