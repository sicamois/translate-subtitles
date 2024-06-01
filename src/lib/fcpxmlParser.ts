import { XMLParser } from 'fast-xml-parser';
import type { FCPTitle, FCPXML } from './fcpxmlTypes';

export type Subtitle = {
  ref: string;
  titles: {
    text: string;
    highlighted: boolean;
    textStyleRef: string;
  }[];
};

export function extractNameAndSubtitles(
  fcpxmlData: string
): [string, Subtitle[]] {
  const alwaysArray = [
    'gap',
    'asset-clip',
    'title',
    'text',
    'text-style',
    'text-style-def',
  ];

  const options = {
    ignoreAttributes: false,
    alwaysCreateTextNode: true,
    ignoreDeclaration: true,
    ignorePiTags: true,
    // parseAttributeValue: true
    isArray: (
      name: string,
      jpath: string,
      isLeafNode: boolean,
      isAttribute: boolean
    ) => {
      if (alwaysArray.indexOf(name) !== -1) return true;
      return false;
    },
  };

  const parser = new XMLParser(options);
  const fcpData = parser.parse(fcpxmlData) as FCPXML;

  const project = fcpData.fcpxml.library.event.project;
  const videoTitle = project['@_name'];
  const mainSpine = project.sequence.spine;

  const assetClips = mainSpine['asset-clip'] ?? [];
  const gaps = mainSpine.gap ?? [];

  const elementsWithTitles = [...assetClips, ...gaps].filter(
    (element) => element.title !== undefined
  );

  if (elementsWithTitles.length === 0) {
    throw new Error('No titles found in the fcpxml file');
  }

  const subtitles: Subtitle[] = [];

  elementsWithTitles.forEach((element) => {
    const subtitlesTitles = element.title as FCPTitle[];
    subtitlesTitles.forEach((title) => {
      const textStyleDefs = title['text-style-def'] ?? [];
      title.text.forEach((text) => {
        if (text['text-style'] !== undefined) {
          const ref = title['@_ref'];
          const textStyles = text['text-style'];
          const titles = textStyles.map((textStyle) => {
            const textStyleRef = textStyle['@_ref'];
            const text = textStyle['#text'] ?? '\n';
            // We are sure to find the textStyleRef in the textStyleDefs
            const textStyleDef = textStyleDefs.find(
              (def) => def['@_id'] === textStyleRef
            )!;
            const correxpondingTextStyle = textStyleDef['text-style'][0];
            const fontColorValue =
              correxpondingTextStyle?.['@_fontColor']
                ?.split(' ')
                .reduce((acc, value) => acc + parseFloat(value), 0) ?? 0;
            const highlighted =
              text !== '\n' && Math.round(fontColorValue) !== 4;
            return {
              textStyleRef,
              text,
              highlighted,
            };
          });
          subtitles.push({
            ref,
            titles,
          });
        }
      });
    });
  });

  const orderedSubtitles = subtitles.sort((a, b) => {
    return a.ref.localeCompare(b.ref);
  });

  return [videoTitle, orderedSubtitles];
}

// function frameStringToSeconds(frameString?: string) {
//   if (frameString === undefined) {
//     return 0;
//   }
//   // Remove the trailing "s"
//   const cleanedFrameString = frameString.slice(0, -1);

//   if (cleanedFrameString.includes('/')) {
//     const [frame, fps] = cleanedFrameString.split('/');
//     return parseInt(frame) / parseInt(fps);
//   }
//   return parseInt(cleanedFrameString);
// }

// function timeStringToSeconds(frameString: string) {
//   const [hours, minutes, seconds] = frameString.split(':');
//   return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
// }

// function frameStringtoTimingString(
//   frameString: string = '0s', // Eg: title['@_offset']
//   sequenceStartFrameString: string = '0s',
//   parentOffsetFrameString: string = '0s',
//   titleDurationFrameString: string = '0s'
// ) {
//   const numberFractionFormatter = new Intl.NumberFormat('FR-fr', {
//     minimumFractionDigits: 3,
//     maximumFractionDigits: 3,
//   });
//   const numberFormatter = new Intl.NumberFormat(undefined, {
//     minimumIntegerDigits: 2,
//   });

//   const frame = frameStringToSeconds(frameString);
//   const sequenceStart = frameStringToSeconds(sequenceStartFrameString);
//   const parentOffset = frameStringToSeconds(parentOffsetFrameString);
//   const titleDuration = frameStringToSeconds(titleDurationFrameString);

//   const timing = frame - (sequenceStart - parentOffset) + titleDuration;
//   const hours = Math.floor(timing / 3600);
//   const minutes = Math.floor((timing % 3600) / 60);
//   const seconds = timing % 60;
//   return `${numberFormatter.format(hours)}:${numberFormatter.format(
//     minutes
//   )}:${numberFractionFormatter.format(seconds)}`;
// }
