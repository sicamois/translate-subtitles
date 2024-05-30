'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile } from '@/app/actions';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Spinner from './Spinner';
import { LabelsDictionary, SuppportedLocale } from '@/app/dictionaries';

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const initialState: {
    message: string;
  } = {
    message: '',
  };

  const [state, formAction] = useActionState(uploadFile, initialState);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        className='flex gap-2 w-fit mt-8 text-lg'
        size={'lg'}
        type='submit'
        disabled={pending}
        aria-disabled={pending}
      >
        {pending && <Spinner />}
        {pending ? labelsDict.file.upload : labelsDict.file.uploading}
      </Button>
    );
  }

  return (
    <form
      className='flex flex-col gap-3 items-center m-auto'
      action={formAction}
    >
      <Label htmlFor='file' className='text-center'>
        {labelsDict.file.selectFile}
      </Label>
      <Input
        className='text-lg'
        type='file'
        id='file'
        name='file'
        accept='.fcpxml'
        required
      />
      <SubmitButton />
      <p aria-live='polite' className='sr-only' role='status'>
        {state?.message}
      </p>
    </form>
  );
}
