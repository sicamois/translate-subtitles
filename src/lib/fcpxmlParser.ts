import { XMLParser } from 'fast-xml-parser';

export type Subtitle = {
  ref: string;
  timelineIn: string;
  timelineOut: string;
  duration: string;
  text: string;
};

type FCPElement = {
  '@_name': string;
  '@_offset': string;
  '@_start': string;
  '@_duration': string;
};

type FCPRef = {
  '@_ref': string;
};

type FCPTitle = FCPElement &
  FCPRef & {
    '@_lane': string;
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
  };

type FCPAssetClip = FCPElement &
  FCPRef & {
    '@_format': string;
    '@_tcFormat': string;
    '@_audioRole': string;
    '@_audioStart'?: string;
    '@_audioDuration'?: string;
    title?: FCPTitle;
    clip?: any;
    keyword?: any;
    'adjust-volume'?: any;
    'adjust-transform'?: any;
    'audio-channel-source'?: any;
  };

type FCPGap = FCPElement & {
  spine?: any[];
  'asset-clip': FCPAssetClip[];
  title?: FCPTitle[];
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
      '@_version': string;
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
              gap: FCPGap[];
              'asset-clip'?: FCPAssetClip[];
              transition: any;
              video: any;
            };
          };
        };
      };
      'smart-collection': any;
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
  const alwaysArray = ['gap', 'asset-clip'];

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
  const fcpData = parser.parse(fcpxmlData) as FCPData;

  const videoTitle = fcpData.fcpxml.library.event.project['@_name'];

  const gapTitles = fcpData.fcpxml.library.event.project.sequence.spine.gap
    .filter((gap) => gap.title !== undefined)
    .map((gap) => gap.title)
    .flat()
    .filter(
      (title) => title !== undefined && title['@_role'] === 'SUB ENG.SUB ENG-1'
    ) as FCPTitle[];

  const assetClips =
    fcpData.fcpxml.library.event.project.sequence.spine['asset-clip'];
  const assetClipTitles =
    assetClips === undefined
      ? []
      : (assetClips
          .filter((assetClip) => assetClip.title !== undefined)
          .map((assetClip) => assetClip.title)
          .flat() as FCPTitle[]);

  const titles = [...gapTitles, ...assetClipTitles];

  const initialOffset = '0s';
  // fcpData.fcpxml.library.event.project.sequence.spine.gap['@_start'];
  // const titles = fcpData.fcpxml.library.event.project.sequence.spine.gap.;

  const subtitles: Subtitle[] = [];
  for (const title of titles) {
    if (title.text['text-style'] !== undefined) {
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
