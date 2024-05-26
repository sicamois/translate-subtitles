'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile } from '@/app/actions';

const initialState: {
  message: string;
} = {
  message: '',
};

export function UploadFile() {
  const [state, formAction] = useActionState(uploadFile, initialState);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        className='w-fit mt-8 text-lg'
        size={'lg'}
        type='submit'
        aria-disabled={pending}
      >
        Télécharger
      </Button>
    );
  }

  return (
    <form
      className='flex flex-col gap-3 items-center m-auto'
      action={formAction}
    >
      <Label htmlFor='file'>
        Sélectionner le fichier Final Cut Pro <code>.fcpxml</code> contenant les
        sous-titres{' '}
      </Label>
      <Input className='text-lg' type='file' id='file' name='file' required />
      <SubmitButton />
      <p aria-live='polite' className='sr-only' role='status'>
        {state?.message}
      </p>
    </form>
  );
}
