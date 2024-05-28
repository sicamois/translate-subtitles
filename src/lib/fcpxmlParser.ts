import { XMLParser } from 'fast-xml-parser';

export type Subtitle = {
  ref: string;
  timelineIn: string;
  timelineOut: string;
  duration: string;
  text: string;
};

type FCPData = {
  fcpxml: {
    resources: {
      format: any[];
      media: any[];
      effect: any[];
      asset: any[];
    };
    library: {
      '@_location': string;
      event: {
        '@_name': string;
        '@_uid': string;
        project: {
          '@_name': string;
          '@_uid': string;
          '@_id': string;
          '@_modDate': string;
          sequence: {
            spine: {
              gap: {
                // Forcer Array
                '@_name': string;
                '@_start': string;
                '@_offset': string;
                '@_duration': string;
                spine: any[];
                'asset-clip': any[];
                title: {
                  '@_ref': string;
                  '@_lane': string;
                  '@_offset': string;
                  '@_name': string;
                  '@_start': string;
                  '@_duration': string;
                  '@_role': string;
                  param: Record<string, string>;
                  text: {
                    'text-style': {
                      '@_ref': string;
                      '#text': string;
                    };
                  };
                  'text-style-def': {
                    '@_id': string;
                    'text-style': Record<string, string>;
                  }[];
                }[];
              };
            };
          };
        };
        'smart-collection': any[];
      };
      '@_version': string;
    };
  };
};

function frameStringToSeconds(frameString?: string) {
  if (frameString === undefined) {
    return 0;
  }
  // Remove the trailing "s"
  const cleanedFrameString = frameString.slice(0, -1);

  if (cleanedFrameString.includes('/')) {
    const [frame, fps] = cleanedFrameString.split('/');
    return parseInt(frame) / parseInt(fps);
  }
  return parseInt(cleanedFrameString);
}

function frameStringtoTimingString(
  frameString: string,
  initialOffsetFrameString: string = '0/2500s',
  durationFrameString?: string
) {
  const numberFractionFormatter = new Intl.NumberFormat('FR-fr', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const numberFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const start = frameStringToSeconds(frameString);
  const duration = frameStringToSeconds(durationFrameString);
  const initialOffset = frameStringToSeconds(initialOffsetFrameString);
  const timing = start + duration - initialOffset;
  const hours = Math.floor(timing / 3600);
  const minutes = Math.floor((timing % 3600) / 60);
  const seconds = timing % 60;
  return `${numberFormatter.format(hours)}:${numberFormatter.format(
    minutes
  )}:${numberFractionFormatter.format(seconds)}`;
}

export function extractNameAndSubtitles(
  fcpxmlData: string
): [string, Subtitle[]] {
  const options = {
    ignoreAttributes: false,
    alwaysCreateTextNode: true,
    ignoreDeclaration: true,
    ignorePiTags: true,
    // parseAttributeValue: true
  };

  const parser = new XMLParser(options);
  const fcpData = parser.parse(fcpxmlData) as FCPData;

  const videoTitle = fcpData.fcpxml.library.event['@_name'];

  const initialOffset =
    fcpData.fcpxml.library.event.project.sequence.spine.gap['@_start'];
  const titles = fcpData.fcpxml.library.event.project.sequence.spine.gap.title;

  const subtitles: Subtitle[] = [];
  for (const title of titles) {
    if (title['@_role'] === 'SUB ENG.SUB ENG-1') {
      subtitles.push({
        ref: title['@_ref'],
        timelineIn: frameStringtoTimingString(title['@_offset'], initialOffset),
        timelineOut: frameStringtoTimingString(
          title['@_offset'],
          initialOffset,
          title['@_duration']
        ),
        duration: frameStringtoTimingString(title['@_duration']),
        text: title.text['text-style']['#text'],
      });
    }
  }
  return [videoTitle, subtitles];
}
