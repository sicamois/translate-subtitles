import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { decrypt } from '@/lib/utils';
import { notFound } from 'next/navigation';
import fs from 'node:fs/promises';

export default async function ModifySubtitles({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const encryptedFilename = searchParams.file;
  if (!encryptedFilename || typeof encryptedFilename !== 'string') {
    notFound();
  }
  const filename = decrypt(encryptedFilename, process.env.KEY!);
  const xmlData = await fs.readFile(`.public/${filename}`, 'utf-8');

  const regexVideoTitle = '<media id="[^"]*" name="(?<video_title>[^"]*)"';
  const matchVideoTitle = xmlData.match(new RegExp(regexVideoTitle));
  const videoTitle = matchVideoTitle?.groups?.video_title;

  const regexSubtitles =
    '<text>\n[ ]*<text-style ref="(?<ref>.*)">(?<subtitle>.*)</text-style>\n[ ]*</text>';
  const matches = xmlData.matchAll(new RegExp(regexSubtitles, 'g'));

  const subtitles = [];
  for (const match of matches) {
    const groups = match.groups;
    subtitles.push({ ...groups });
  }

  return (
    <div>
      <h1 className='text-center text-4xl font-thin drop-shadow-sm mb-4'>
        {videoTitle}
      </h1>
      <h2 className='text-center text-xl font-thin drop-shadow-sm mb-4'>
        Modify Subtitles
      </h2>
      <form className='flex flex-col gap-2 p-4'>
        {subtitles.map((subtitle, index) => (
          <Card key={index} className='flex gap-2 p-2 items-center group'>
            <CardTitle className='p-2 text-base font-light shrink-0'>
              <span className='font-medium'>{index + 1}</span> ∙ {subtitle?.ref}
            </CardTitle>
            <CardContent
              id={`subtitle-${index}`}
              className='text-base bg-muted text-muted-foreground p-2 w-max shrink-0 rounded-md group-focus-within:bg-primary group-focus-within:text-primary-foreground'
            >
              {subtitle?.subtitle}
            </CardContent>
            <Input
              className='bg-muted-foreground text-muted text-base'
              defaultValue={subtitle?.subtitle}
            />
          </Card>
        ))}
      </form>
    </div>
  );
}
