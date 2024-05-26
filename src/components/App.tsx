'use client';

import { useState } from 'react';
import { UploadFile } from './UploadFile';
import { Card, CardContent, CardTitle } from './ui/card';
import { Input } from './ui/input';

export default function App() {
  const [xmlData, setXmlData] = useState<string>();

  if (xmlData === undefined) {
    return (
      <div className='font-sans flex flex-col items-center justify-items-center min-h-screen pb-20 gap-16'>
        <header className='flex justify-center items-center gap-8 bg-muted w-full p-2'>
          <h1 className='text-4xl font-bold text-muted-foreground text-center'>
            Translate Subtitles
          </h1>
        </header>
        <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start p-8 sm:p-20'>
          <UploadFile setXmlData={setXmlData} />
        </main>
        <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
      </div>
    );
  }

  const regex =
    '<text>\n[ ]*<text-style ref="(?<ref>.*)">(?<subtitle>.*)</text-style>\n[ ]*</text>';
  const matches = xmlData.matchAll(new RegExp(regex, 'g'));

  const subtitles = [];
  for (const match of matches) {
    const groups = match.groups;
    subtitles.push({ ...groups });
  }

  return (
    <form className='flex flex-col gap-2 p-4'>
      {subtitles.map((subtitle, index) => (
        <Card key={index} className='flex gap-2 p-2 items-center'>
          <CardTitle className='p-2 text-base font-light shrink-0'>
            <span className='font-medium'>{index + 1}</span> ∙ {subtitle?.ref}
          </CardTitle>
          <CardContent
            id={`subtitle-${index}`}
            className='text-lg bg-primary text-muted-foreground rounded p-1 px-2 w-max shrink-0'
          >
            {subtitle?.subtitle}
          </CardContent>
          <Input className='bg-muted-foreground text-muted' />
        </Card>
      ))}
    </form>
  );
}
