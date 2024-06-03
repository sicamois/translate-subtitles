'use client';

import { ChangeEvent, useActionState, useRef, useState } from 'react';
import { uploadFile } from '@/app/actions';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Spinner from './Spinner';
import { LabelsDictionary } from '@/app/dictionaries';
import { Switch } from './ui/switch';
import { AcceptedLanguages, languages } from './TranslateSubtitles';

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const initialState: {
    message: string;
  } = {
    message: '',
  };

  const [state, formAction] = useActionState(uploadFile, initialState);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const langArray = Object.entries(languages) as [AcceptedLanguages, string][];
  const [selectedLanguages, setSelectedLanguages] = useState<
    AcceptedLanguages[]
  >(['FRA', 'ESP', 'ARA']);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!formRef.current) return;

    const file = event.target.files?.[0];
    if (!file) return;

    setPending(true);
    const formData = new FormData(formRef.current);
    formAction(formData);
  }

  return (
    <form
      className='flex flex-col gap-3 items-center m-auto'
      action={formAction}
      ref={formRef}
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
        onChange={onFileSelected}
      />
      {pending ? (
        <div className='h-8 text-lg flex gap-2 items-center'>
          <Spinner />
          <p>{labelsDict.file.uploading}</p>
        </div>
      ) : null}
      <p aria-live='polite' className='sr-only' role='status'>
        {state?.message}
      </p>
      <div className='flex justify-center gap-4 mt-8'>
        {langArray.map(([key, value]) => (
          <div key={key} className='flex flex-col gap-2'>
            <Label htmlFor={key} className='text-center'>
              {value}
            </Label>
            <Switch
              id={key}
              name={key}
              checked={selectedLanguages.includes(key)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedLanguages([...selectedLanguages, key]);
                } else {
                  setSelectedLanguages(
                    selectedLanguages.filter((l) => l !== key)
                  );
                }
              }}
            />
          </div>
        ))}
      </div>
    </form>
  );
}
