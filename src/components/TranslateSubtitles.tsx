'use client';

import { use, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createFile, translate } from '@/app/actions';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Spinner from './Spinner';
import type { Subtitle } from '@/lib/fcpxmlParser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Languages } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from './ui/textarea';
import { LabelsDictionary, SuppportedLocale } from '@/app/dictionaries';

const languages = {
  FRA: 'Français',
  ESP: 'Espagnol',
  ARA: 'Arabe',
  ITA: 'Italien',
  RUS: 'Russe',
};

export type AcceptedLanguages = keyof typeof languages;

export default function TranslateSubtitles({
  filename,
  videoTitle,
  subtitles,
  translations,
  labelsDict,
}: {
  filename: string;
  videoTitle: string;
  subtitles: Subtitle[];
  translations: string[];
  labelsDict: LabelsDictionary;
}) {
  const [language, setLanguage] = useState<AcceptedLanguages>('FRA');

  const initialState: {
    subtitles: Subtitle[];
    videoTitle: string;
    url?: string;
    message: string;
  } = {
    subtitles: subtitles.map((subtitle, index) => ({
      ...subtitle,
      text: translations[index],
    })),
    videoTitle,
    message: '',
  };

  const initialTranslateState: {
    translations: string[];
    message: string;
  } = {
    translations,
    message: '',
  };

  const [state, formAction] = useActionState(createFile, initialState);
  const [translationState, translateAction] = useActionState(
    translate,
    initialTranslateState
  );

  function SubmitButton({ url }: { url?: string }) {
    const { pending } = useFormStatus();

    if (url) {
      return (
        <Link
          target='_blank'
          href={url}
          rel='noopener noreferrer'
          download={filename}
          className='flex gap-2 items-center justify-center mx-auto mt-8  p-2 text-lg'
        >
          <Download size={24} />
          <span>{labelsDict.file.download}</span>
        </Link>
      );
    }

    return (
      <Button
        className='flex gap-2 w-fit mx-auto mt-8 text-lg'
        size={'lg'}
        type='submit'
        disabled={pending}
        aria-disabled={pending}
      >
        {pending && <Spinner />}
        {pending ? labelsDict.file.creatingFile : labelsDict.file.createFile}
      </Button>
    );
  }

  return (
    <form className='w-full flex flex-col gap-2 p-4' action={formAction}>
      <div className='relative flex gap-8 p-2 items-center justify-end mb-4'>
        <div className='flex justify-evenly w-1/2'>
          <div className='flex gap-2 items-center'>
            <Label htmlFor='language' className='text-xl font-light'>
              {labelsDict.translate.language}
            </Label>
            <select
              id='language'
              name='language'
              className='appearance-none h-10 px-4 bg-muted-foreground text-muted text-xl rounded-md'
              defaultValue={language}
              onChange={(e) =>
                setLanguage(e.target.value as keyof typeof languages)
              }
            >
              {Object.entries(languages).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <Button
            formAction={translateAction}
            className='h-10 text-lg bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 p-2 transition-colors duration-100 ease-in-out pointer-events-auto'
          >
            <div className='flex gap-1 items-center'>
              <Languages className='h-5 w-5' />
              <p className='font-medium drop-shadow'>
                {labelsDict.translate.aiAssistant}
              </p>
            </div>
          </Button>
        </div>
      </div>
      <Table className='w-full rounded-t-md overflow-hidden'>
        <TableHeader className='text-lg font-medium bg-primary text-primary-foreground'>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>{labelsDict.translate.subtitle}</TableHead>
            <TableHead>{languages[language]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtitles.map((subtitle, index) => (
            <TableRow key={index} className='group py-2'>
              <TableCell className='align-top shrink-0 py-2'>
                <p className='py-2'>{index + 1}</p>
              </TableCell>
              <TableCell className='align-top w-1/2 shrink py-2'>
                <p className='w-fit p-2 text-base font-medium rounded-md group-focus-within:bg-secondary group-focus-within:text-secondary-foreground transition-colors duration-100 ease-in-out'>
                  {subtitle.text}
                </p>
              </TableCell>
              <TableCell className=' w-1/2 shrink py-0'>
                <Textarea
                  className='bg-muted-foreground text-muted text-base'
                  id={subtitle.ref}
                  name={subtitle.ref}
                  defaultValue={translationState.translations[index]}
                  rows={Math.ceil(subtitle.text.length / 60)}
                  required
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SubmitButton url={state.url} />
    </form>
  );
}
