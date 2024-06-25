import { LabelsDictionary } from '../dictionaries';

export default function VideoTitle(props: {
  videoTitle: string;
  labelsDict: LabelsDictionary;
}) {
  return (
    <section className="flex flex-col items-center gap-2">
      <h1 className="px-4 text-center text-2xl font-light drop-shadow-sm sm:text-4xl">
        {props.videoTitle}
      </h1>
      <h2 className="text-center text-xl font-extralight drop-shadow-sm">
        {props.labelsDict.translate.translateSubtitles}
      </h2>
    </section>
  );
}
