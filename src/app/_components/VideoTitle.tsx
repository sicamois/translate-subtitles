import { extractVideoTitle } from '@/lib/fcpxmlParser';
import { use } from 'react';
import { LabelsDictionary } from '../dictionaries';
import { exctractFCPXML } from '@/lib/fcpxmlUtils';

export default function VideoTitle(props: {
  filenamePromise: Promise<string>;
  labelsDictPromise: Promise<LabelsDictionary>;
}) {
  const labelsDict = use(props.labelsDictPromise);
  const filename = use(props.filenamePromise);
  const fcpxml = use(exctractFCPXML(filename));
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
