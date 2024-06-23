import { extractVideoTitle } from '@/lib/fcpxmlParser';
import { FCPXML } from '@/lib/fcpxmlTypes';
import { use } from 'react';
import { LabelsDictionary } from '../dictionaries';

export default function VideoTitle(props: {
  fcpxmlPromise: Promise<FCPXML>;
  labelsDictPromise: Promise<LabelsDictionary>;
}) {
  const labelsDict = use(props.labelsDictPromise);
  const fcpxml = use(props.fcpxmlPromise);
  const videoTitle = extractVideoTitle(fcpxml);
  return (
    <section className="flex flex-col items-center gap-2">
      <h1 className="px-4 text-center text-2xl font-light drop-shadow-sm sm:text-4xl">
        {videoTitle}
      </h1>
      <h2 className="text-center text-xl font-extralight drop-shadow-sm">
        {labelsDict.translate.translateSubtitles}
      </h2>
    </section>
  );
}
