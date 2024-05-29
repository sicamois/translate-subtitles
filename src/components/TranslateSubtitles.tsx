'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createFile } from '@/app/actions';
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
import { Card } from './ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from './ui/textarea';

export default function TranslateSubtitles({
  filename,
  videoTitle,
  subtitles,
}: {
  filename: string;
  videoTitle: string;
  subtitles: Subtitle[];
}) {
  const languages = {
    FRA: 'Français',
    ESP: 'Espagnol',
    ARA: 'Arabe',
    ITA: 'Italien',
    RUS: 'Russe',
  };
  const [language, setLanguage] = useState<keyof typeof languages>('FRA');

  const translations = subtitles.map((subtitle) => {
    return subtitle.text;
  });

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

  const [state, formAction] = useActionState(createFile, initialState);

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
          <span>Télécharger le fichier modifié</span>
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
        {pending ? 'Création en cours...' : 'Créer le nouveau fichier'}
      </Button>
    );
  }

  return (
    <form className='w-full flex flex-col gap-2 p-4' action={formAction}>
      <Card className='flex gap-2 p-2 items-center justify-center mb-4'>
        <Label htmlFor='language' className='text-xl font-light'>
          Langue
        </Label>
        <select
          id='language'
          name='language'
          className='appearance-none px-4 py-2 bg-muted-foreground text-muted text-xl rounded-md'
          defaultValue='FRA'
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
      </Card>
      <Table className='w-full rounded-t-md overflow-hidden'>
        <TableHeader className='text-lg font-medium bg-primary text-primary-foreground'>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Sous-titre</TableHead>
            <TableHead>{languages[language]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtitles.map((subtitle, index) => (
            <TableRow key={index} className='group'>
              <TableCell className='align-top shrink-0'>
                <p className='py-2'>{index + 1}</p>
              </TableCell>
              <TableCell className='align-top w-1/2 shrink'>
                <p className='w-fit p-2 text-base rounded-md group-focus-within:bg-secondary group-focus-within:text-secondary-foreground transition-colors duration-200 ease-in-out'>
                  {subtitle.text}
                </p>
              </TableCell>
              <TableCell className=' w-1/2 shrink'>
                <Textarea
                  className='bg-muted-foreground text-muted text-base'
                  id={subtitle.ref}
                  name={subtitle.ref}
                  defaultValue={translations[index]}
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
