import { extractVideoTitle } from '@/lib/fcpxmlParser';
import { FCPXML } from '@/lib/fcpxmlTypes';
import { use } from 'react';

export default function Title(props: { fcpxml: Promise<FCPXML> }) {
  const fcpxml = use(props.fcpxml);
  const videoTitle = extractVideoTitle(fcpxml);
  return (
    <h1 className="px-4 text-center text-2xl font-light drop-shadow-sm sm:text-4xl">
      {videoTitle}
    </h1>
  );
}
