'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createFile } from '@/app/actions';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Spinner from './Spinner';
import type { Subtitle } from '@/app/modify-subtitles/page';
import { Card, CardContent, CardTitle } from './ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';

export function DownloadFile({
  filename,
  subtitles,
}: {
  filename: string;
  subtitles: Subtitle[];
}) {
  const initialState: {
    filename: string;
    url?: string;
    message: string;
  } = {
    filename,
    message: '',
  };

  const [state, formAction] = useActionState(createFile, initialState);

  function SubmitButton({ url }: { url?: string }) {
    const { pending } = useFormStatus();

    if (url) {
      console.log('url', url);
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
    <form className='flex flex-col gap-2 p-4' action={formAction}>
      <Card className='flex gap-2 p-2 items-center justify-center mb-4'>
        <Label htmlFor='language' className='text-xl font-light'>
          Langue
        </Label>
        <select
          id='language'
          name='language'
          className='appearance-none px-4 py-2 bg-muted-foreground text-muted text-xl rounded-md'
          defaultValue='FR'
        >
          <option value='FR'>Français</option>
          <option value='ES'>Espagnol</option>
          <option value='AR'>Arabe</option>
        </select>
      </Card>
      {subtitles.map((subtitle, index) => (
        <Card key={index} className='flex gap-2 p-2 items-center group'>
          <CardTitle className='flex gap-1 p-2 text-base font-light shrink-0'>
            <p className='font-medium'>{index + 1}</p>
            <p>∙</p>
            <p className='group-focus-within:text-secondary'>{subtitle?.ref}</p>
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
            id={subtitle?.ref}
            name={subtitle?.ref}
            defaultValue={subtitle?.subtitle}
          />
        </Card>
      ))}
      <SubmitButton url={state.url} />
    </form>
  );
}
