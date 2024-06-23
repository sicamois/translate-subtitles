import 'server-only';

import { XMLParser } from 'fast-xml-parser';
import type { Title as FCPTitle, FCPXML } from './fcpxmlTypes';

export type Subtitle = {
  ref?: string;
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

export function extractFcpxml(fcpxmlData: string) {
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
    // ignoreDeclaration: false,
    // ignorePiTags: true,
    // preserveOrder: true,
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
  return parser.parse(fcpxmlData) as { fcpxml: FCPXML };
}

function extractProject(fcpxml: FCPXML) {
  const events = fcpxml.library?.event;

  if (events === undefined) {
    throw new Error('No event found in the fcpxml file');
  }

  const mainEvent = events[0];
  const projects = mainEvent.project;

  if (projects === undefined) {
    throw new Error('No project found in the fcpxml file');
  }

  return projects[0];
}

export function extractVideoTitle(fcpxml: FCPXML) {
  const project = extractProject(fcpxml);
  const videoTitle = project['@_name'];

  return videoTitle;
}

export function extractNameAndSubtitles(
  fcpxmlData: string,
): [string | undefined, Subtitle[]] {
  const { fcpxml } = extractFcpxml(fcpxmlData);

  const events = fcpxml.library?.event;

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
          const text = textStyle['#text'] ?? '§';
          // We are sure to find the textStyleRef in the textStyleDefs
          const textStyleDef = textStyleDefs.find(
            (def) => def['@_id'] === textStyleRef,
          )!;
          const correxpondingTextStyle = textStyleDef['text-style'];
          const fontColorValue =
            correxpondingTextStyle['@_fontColor']
              ?.split(' ')
              .reduce((acc, value) => acc + parseFloat(value), 0) ?? 0;
          const highlighted = text !== '§' && Math.round(fontColorValue) !== 4;
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

  return [videoTitle, subtitles];
}

export function replaceSubtitlesInFCPXML(
  fcpxmlData: { fcpxml: FCPXML },
  subtitles: Subtitle[],
) {
  replaceSubtitles(fcpxmlData, subtitles);
  return fcpxmlData;
}
let index = 0;
function replaceSubtitles(element: any, subtitles: Subtitle[]) {
  if (index > subtitles.length) {
    throw new Error(
      `Not enough subtitles to replace - index: ${index} - subtitles length: ${subtitles.length}`,
    );
  }
  if ('title' in element) {
    const titles = element.title as FCPTitle[];
    for (const title of titles) {
      if (title.text) {
        title.text.forEach((aText) => {
          switch (true) {
            case aText['#text'] !== undefined: {
              if (subtitles[index].titles.length !== 1) {
                throw new Error(
                  `Too many subtitles to replace - index: ${index} - subtitles length: ${subtitles.length}
subtitles: ${JSON.stringify(subtitles[index], null, 2)}
text styles: ${JSON.stringify(aText['text-style'], null, 2)}`,
                );
              }
              aText['#text'] = subtitles[index].titles[0].text;
              index++;
              return;
            }
            case aText['text-style'] !== undefined: {
              let textStyleIndex = 0;
              aText['text-style'].forEach((textStyle) => {
                if (textStyleIndex >= subtitles[index].titles.length) {
                  throw new Error(
                    `Too many text styles to replace - index: ${index} - text styles length: ${textStyleIndex + 1} - subtitles length: ${subtitles[index].titles.length}
subtitles: ${JSON.stringify(subtitles[index], null, 2)}
text styles: ${JSON.stringify(aText['text-style'], null, 2)}`,
                  );
                }
                textStyle['#text'] =
                  subtitles[index].titles[textStyleIndex].text;
                textStyleIndex++;
              });
              index++;
              return;
            }
          }
        });
      }
    }
  }

  for (const key in element) {
    if (Array.isArray(element[key])) {
      for (const subElement of element[key]) {
        replaceSubtitles(subElement, subtitles);
      }
      // null is of type object !!!
    } else if (typeof element[key] === 'object') {
      replaceSubtitles(element[key], subtitles);
    }
  }
}
