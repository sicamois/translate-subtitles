import 'server-only';
import { XMLParser } from 'fast-xml-parser';
import type { Title as FCPTitle, FCPXML } from './fcpxmlTypes';
import fileContentFromS3 from './fileContentFromS3';

export type Subtitle = {
  ref?: string;
  titles: {
    text: string;
    highlighted: boolean;
    textStyleRef?: string;
  }[];
};

const ALWAYS_ARRAY = [
  'event',
  'project',
  'gap',
  'asset-clip',
  'clip',
  'audition',
  'mc-clip',
  'ref-clip',
  'sync-clip',
  'collection-folder',
  'keyword-collection',
  'smart-collection',
  'title',
  'text',
  'text-style',
  'text-style-def',
];

const XML_PARSER_OPTIONS = {
  ignoreAttributes: false,
  alwaysCreateTextNode: true,
  isArray: (name: string, jpath: string) =>
    ALWAYS_ARRAY.includes(name) && !jpath.includes('text-style-def.text-style'),
};

export function parseFCPXML(fcpxmlData: string): { fcpxml: FCPXML } {
  const parser = new XMLParser(XML_PARSER_OPTIONS);
  return parser.parse(fcpxmlData);
}

export async function exctractFCPXML(filename: string) {
  const content = await fileContentFromS3(filename);
  return parseFCPXML(content);
}

function extractProject(fcpxml: FCPXML) {
  const events = fcpxml.library?.event;
  if (!events) throw new Error('No event found in the fcpxml file');

  const projects = events[0].project;
  if (!projects) throw new Error('No project found in the fcpxml file');

  return projects[0];
}

export async function extractVideoTitle(fcpxmlFilename: string) {
  const { fcpxml } = await exctractFCPXML(fcpxmlFilename);
  const project = extractProject(fcpxml);
  const videoTitle = project['@_name'];

  if (!videoTitle) throw new Error('No video title found in the fcpxml file');

  return videoTitle;
}

export function extractTitleElements(element: any): FCPTitle[] {
  let titles: FCPTitle[] = element.title || [];

  for (const key in element) {
    if (Array.isArray(element[key])) {
      for (const subElement of element[key]) {
        titles = titles.concat(extractTitleElements(subElement));
      }
    } else if (typeof element[key] === 'object') {
      titles = titles.concat(extractTitleElements(element[key]));
    }
  }

  return titles;
}

export async function extractSubtitles(
  fcpxmlFilename: string,
): Promise<Subtitle[]> {
  const { fcpxml } = await exctractFCPXML(fcpxmlFilename);
  const titles = extractTitleElements(fcpxml);

  return titles.flatMap((title) => {
    if (!title.text) return [];

    const textStyleDefs = title['text-style-def'] || [];

    return title.text.flatMap((text) => {
      if (!text['text-style']) return [];

      const ref = title['@_ref'];
      return [
        {
          ref,
          titles: text['text-style'].map((textStyle) => {
            const textStyleRef = textStyle['@_ref'];
            const textContent = textStyle['#text'] || '§';
            const textStyleDef = textStyleDefs.find(
              (def) => def['@_id'] === textStyleRef,
            );
            const fontColorValue =
              textStyleDef?.['text-style']['@_fontColor']
                ?.split(' ')
                .reduce((acc, value) => acc + parseFloat(value), 0) || 0;
            const highlighted =
              textContent !== '§' && Math.round(fontColorValue) !== 4;

            return { textStyleRef, text: textContent, highlighted };
          }),
        },
      ];
    });
  });
}

export function replaceSubtitlesInFCPXML(
  xml: { fcpxml: FCPXML },
  subtitles: Subtitle[],
): { fcpxml: FCPXML } {
  let subtitleIndex = 0;

  function replaceSubtitlesRecursive(element: any) {
    if ('title' in element) {
      for (const title of element.title) {
        if (title.text) {
          for (const aText of title.text) {
            if (aText['#text'] !== undefined) {
              if (subtitles[subtitleIndex].titles.length !== 1) {
                throw new Error(
                  `Mismatch in subtitle structure at index ${subtitleIndex}`,
                );
              }
              aText['#text'] = subtitles[subtitleIndex].titles[0].text;
              subtitleIndex++;
            } else if (aText['text-style'] !== undefined) {
              if (
                aText['text-style'].length !==
                subtitles[subtitleIndex].titles.length
              ) {
                throw new Error(
                  `Mismatch in the number of subtitles : original has ${aText['text-style'].length} elements and translated has ${subtitles[subtitleIndex].titles.length} elements \noriginal subtitiles: ${JSON.stringify(aText['text-style'], null, 2)} \ntranslated subtitiles: ${JSON.stringify(subtitles[subtitleIndex].titles, null, 2)}`,
                );
              }
              aText['text-style'].forEach((textStyle, i) => {
                textStyle['#text'] = subtitles[subtitleIndex].titles[i].text;
              });
              subtitleIndex++;
            }
          }
        }
      }
    }

    for (const key in element) {
      if (Array.isArray(element[key])) {
        element[key].forEach(replaceSubtitlesRecursive);
      } else if (typeof element[key] === 'object') {
        replaceSubtitlesRecursive(element[key]);
      }
    }
  }

  replaceSubtitlesRecursive(xml);

  if (subtitleIndex !== subtitles.length) {
    throw new Error(
      `Not all subtitles were replaced. Processed: ${subtitleIndex}, Total: ${subtitles.length}`,
    );
  }

  return xml;
}
