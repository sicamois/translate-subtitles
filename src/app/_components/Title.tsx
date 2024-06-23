import { extractVideoTitle } from '@/lib/fcpxmlParser';
import { FCPXML } from '@/lib/fcpxmlTypes';
import { Suspense, use } from 'react';

export default function Title(props: { fcpxml: Promise<FCPXML> }) {
  const fcpxml = use(props.fcpxml);
  const videoTitle = extractVideoTitle(fcpxml);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1 className="mt-8 px-4 text-center text-2xl font-light drop-shadow-sm sm:text-4xl">
        {videoTitle}
      </h1>
    </Suspense>
  );
}
