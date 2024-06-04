'use client';

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { uploadFile } from '@/app/actions';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Spinner from './Spinner';
import { LabelsDictionary } from '@/app/dictionaries';
import { Switch } from './ui/switch';
import { AcceptedLanguages, languages } from './TranslateSubtitles';
import { toast } from 'sonner';
import ToastContent from './ToastContent';
import { set } from 'zod';

export function UploadFile({ labelsDict }: { labelsDict: LabelsDictionary }) {
  const initialState: {
    message: string;
  } = {
    message: '',
  };

  const [{ message }, formAction, isPending] = useActionState(
    uploadFile,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const langArray = Object.entries(languages) as [AcceptedLanguages, string][];
  const [selectedLanguages, setSelectedLanguages] = useState<
    AcceptedLanguages[]
  >(['FRA', 'ESP', 'ARA']);

  useEffect(() => {
    if (message !== '') {
      formRef?.current?.reset();
      toast(ToastContent('Error on file upload', message));
    }
  }, [message]);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!formRef.current) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData(formRef.current);
    formAction(formData);
  }

  return (
    <form
      className="m-auto flex flex-col items-center gap-4"
      action={formAction}
      ref={formRef}
    >
      <Label htmlFor="file" className="text-center">
        {labelsDict.file.selectFile}
      </Label>
      <div className="rounded-lg bg-gradient-to-l from-blue-600 to-emerald-500 p-[2px]">
        <Input
          className="h-24 cursor-pointer border-none p-9 text-lg text-primary"
          type="file"
          id="file"
          name="file"
          accept=".fcpxml"
          required
          onChange={onFileSelected}
        />
      </div>
      {isPending ? (
        <div className="flex h-8 items-center gap-2 text-lg">
          <Spinner />
          <p>{labelsDict.file.uploading}</p>
        </div>
      ) : null}
      <div className="mt-8 flex justify-center gap-4">
        {langArray.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <Label htmlFor={key} className="text-center">
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
                    selectedLanguages.filter((l) => l !== key),
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
