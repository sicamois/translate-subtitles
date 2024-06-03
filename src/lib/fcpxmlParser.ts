import { XMLParser } from 'fast-xml-parser';
import type { Title as FCPTitle, FCPXML } from './fcpxmlTypes';

export type Subtitle = {
  ref: string;
  titles: {
    text: string;
    highlighted: boolean;
    textStyleRef?: string;
  }[];
};

function extractTitleElements(element: any): FCPTitle[] {
  let titles: FCPTitle[] = [];

  if (element.title) {
    titles.push(...element.title);
  }

  for (const key in element) {
    if (Array.isArray(element[key])) {
      for (const subElement of element[key]) {
        titles.push(...extractTitleElements(subElement));
      }
    } else if (typeof element[key] === 'object') {
      titles.push(...extractTitleElements(element[key]));
    }
  }

  return titles;
}

export function extractNameAndSubtitles(
  fcpxmlData: string,
): [string | undefined, Subtitle[]] {
  const alwaysArray = [
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
      isAttribute: boolean,
    ) => {
      if (
        alwaysArray.indexOf(name) !== -1 &&
        !jpath.includes('text-style-def.text-style') &&
        !jpath.includes('text-style-def.text-style')
      )
        return true;
      return false;
    },
  };

  const parser = new XMLParser(options);
  const fcpData = parser.parse(fcpxmlData) as { fcpxml: FCPXML };

  const events = fcpData.fcpxml.library?.event;

  if (events === undefined) {
    throw new Error('No event found in the fcpxml file');
  }

  const mainEvent = events[0];
  const projects = mainEvent.project;

  if (projects === undefined) {
    throw new Error('No project found in the fcpxml file');
  }

  const project = projects[0];
  const videoTitle = project['@_name'];

  const titles = extractTitleElements(project);

  if (titles.length === 0) {
    throw new Error('No titles found in the fcpxml file');
  }

  const subtitles: Subtitle[] = [];

  for (const title of titles) {
    const textStyleDefs = title['text-style-def'] ?? [];
    if (!title.text) {
      continue;
    }
    title.text.forEach((text) => {
      if (text['text-style'] !== undefined) {
        const ref = title['@_ref'];
        const textStyles = text['text-style'];
        const textTitles = textStyles.map((textStyle) => {
          const textStyleRef = textStyle['@_ref'];
          const text = textStyle['#text'] ?? '\n';
          // We are sure to find the textStyleRef in the textStyleDefs
          const textStyleDef = textStyleDefs.find(
            (def) => def['@_id'] === textStyleRef,
          )!;
          const correxpondingTextStyle = textStyleDef['text-style'];
          const fontColorValue =
            correxpondingTextStyle['@_fontColor']
              ?.split(' ')
              .reduce((acc, value) => acc + parseFloat(value), 0) ?? 0;
          const highlighted = text !== '\n' && Math.round(fontColorValue) !== 4;
          return {
            textStyleRef,
            text,
            highlighted,
          };
        });
        subtitles.push({
          ref,
          titles: textTitles,
        });
      }
    });
  }

  subtitles.sort((a, b) => {
    return a.ref.localeCompare(b.ref);
  });

  return [videoTitle, subtitles];
}
