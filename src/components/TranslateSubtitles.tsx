'use client';

import { FormEvent, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { translate } from '@/app/actions';
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
import { LabelsDictionary } from '@/app/dictionaries';
import { cn } from '@/lib/utils';

export const languages = {
  FRA: 'Français',
  ESP: 'Español',
  ARA: 'Arabic',
  ITA: 'Italiano',
  RUS: 'Russkiy',
} as const;

export type AcceptedLanguages = keyof typeof languages;

export default function TranslateSubtitles({
  videoTitle,
  subtitles,
  translations,
  labelsDict,
}: {
  videoTitle: string;
  subtitles: Subtitle[];
  translations?: string[];
  labelsDict: LabelsDictionary;
}) {
  const [language, setLanguage] = useState<AcceptedLanguages>('FRA');

  const initialState: {
    subtitles: Subtitle[];
    videoTitle: string;
    url?: string;
    message: string;
  } = {
    subtitles,
    videoTitle,
    message: '',
  };

  const initialTranslateState: {
    subtitles: Subtitle[];
    translations: string[];
    message: string;
  } = {
    subtitles,
    translations: [],
    message: '',
  };

  // const [state, formAction] = useActionState(createFile, initialState);
  const [translationState, translateAction] = useActionState(
    translate,
    initialTranslateState,
  );

  // function SubmitButton({ url }: { url?: string }) {
  //   const { pending } = useFormStatus();

  //   if (url) {
  //     return (
  //       <Link
  //         target='_blank'
  //         href={url}
  //         rel='noopener noreferrer'
  //         download={filename}
  //         className='flex gap-2 items-center justify-center mx-auto mt-8  p-2 text-lg'
  //       >
  //         <Download size={24} />
  //         <span>{labelsDict.file.download}</span>
  //       </Link>
  //     );
  //   }

  //   return (
  //     <Button
  //       className='flex gap-2 w-fit mx-auto mt-8 text-lg'
  //       size={'lg'}
  //       type='submit'
  //       disabled={pending}
  //       aria-disabled={pending}
  //     >
  //       {pending && <Spinner />}
  //       {pending ? labelsDict.file.creatingFile : labelsDict.file.createFile}
  //     </Button>
  //   );
  // }

  // function autoresize(event: FormEvent<HTMLTextAreaElement>) {
  //   const self = event.currentTarget as HTMLTextAreaElement;
  //   event.bubbles = true;
  //   self.style.height = '0px';
  //   self.style.height = self.scrollHeight + 'px';
  // }

  return (
    <form
      className="flex flex-col items-center gap-2 p-2" /* action={formAction} */
    >
      <Table className="w-fit overflow-hidden">
        <TableHeader className="bg-primary text-lg font-medium text-primary-foreground">
          <TableRow>
            <TableHead className="w-6 rounded-s-md">#</TableHead>
            <TableHead
              className={cn(
                'w-[24rem]',
                translations === undefined ? 'rounded-e-md' : '',
              )}
            >
              {labelsDict.translate.subtitle}
            </TableHead>
            {translations ? (
              <TableHead className="w-[24rem] rounded-e-md">
                {languages[language]}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtitles.map((subtitle, index) => (
            <TableRow key={index} className="py-2">
              <TableCell className="w-6 py-2">
                <p>{index + 1}</p>
              </TableCell>
              <TableCell className="flex w-[24rem] flex-wrap gap-1 p-2 text-base font-medium">
                {subtitle.titles.map((title, index) =>
                  title.highlighted ? (
                    <span key={index} className="text-red-500">
                      {title.text}
                    </span>
                  ) : (
                    <p key={index}>{title.text}</p>
                  ),
                )}
              </TableCell>
              {translations ? (
                <TableCell
                  className="w-[24rem] p-2 text-base font-medium"
                  dir="auto"
                  dangerouslySetInnerHTML={{
                    __html: translationState.translations[index],
                  }}
                ></TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap justify-center gap-4 p-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="language" className="text-xl font-light">
            {labelsDict.translate.language}
          </Label>
          <select
            id="language"
            name="language"
            className="h-10 appearance-none rounded-md bg-muted-foreground px-4 text-xl text-muted"
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
          className="pointer-events-auto h-10 bg-gradient-to-r from-pink-400 to-purple-600 p-2 text-lg transition-colors duration-100 ease-in-out hover:from-pink-500 hover:to-purple-700"
        >
          <div className="flex items-center gap-1">
            <Languages className="h-5 w-5" />
            <p className="font-medium drop-shadow">
              {labelsDict.translate.aiAssistant}
            </p>
          </div>
        </Button>
      </div>
      {/* <SubmitButton url={state.url} /> */}
    </form>
  );
}
