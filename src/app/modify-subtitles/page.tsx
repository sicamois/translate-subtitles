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
  const fileUrl = decrypt(encryptedFilename, process.env.KEY!);
  const xmlFile = await fetch(fileUrl);
  const xmlData = await xmlFile.text();

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
      <h2 className='text-center text-xl italic font-thin drop-shadow-sm mb-4'>
        Traduire les sous-titres
      </h2>
      <form className='flex flex-col gap-2 p-4'>
        {subtitles.map((subtitle, index) => (
          <Card key={index} className='flex gap-2 p-2 items-center group'>
            <CardTitle className='flex gap-1 p-2 text-base font-light shrink-0'>
              <p className='font-medium'>{index + 1}</p>
              <p>∙</p>
              <p className='group-focus-within:text-secondary'>
                {subtitle?.ref}
              </p>
            </CardTitle>
            <CardContent
              id={`subtitle-${index}`}
              className='text-base bg-muted text-muted-foreground p-2 w-max shrink-0 rounded-md group-focus-within:bg-secondary group-focus-within:text-secondary-foreground transition-colors duration-200 ease-in-out'
            >
              {subtitle?.subtitle}
            </CardContent>
            <p>→</p>
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
