import { XMLParser } from 'fast-xml-parser';

export type Subtitle = {
  ref: string;
  timelineIn: string;
  timelineOut: string;
  duration: string;
  text: string;
};

type FCPTimingAttributes = {
  '@_offset'?: string;
  '@_start'?: string;
  '@_duration'?: string;
};

type FCPTimelineAttributes = {
  '@_format': string;
  '@_tcStart'?: string;
  '@_tcFormat': string;
  '@_audioLayout'?: string;
  '@_audioRate'?: string;
};

type FCPAnchorableAttributes = {
  '@_lane'?: string;
};

type FCPElementAttributes = FCPTimingAttributes & {
  '@_name'?: string;
  '@_enabled'?: string;
};

type FCPTextAttributes = {
  '@_display-style'?: string;
  '@_roll-up-height'?: string;
  '@_position'?: string;
  '@_placement'?: string;
  '@_alignment'?: string;
};

type FCPTextStyleAttributes = {
  '@_font'?: string;
  '@fontFace'?: string;
  '@_fontSize'?: string;
  '@_fontColor'?: string;
  '@_backgroundColor'?: string;
  '@_bold'?: string;
  '@_italic'?: string;
  '@_strokeColor'?: string;
  '@_strokeWidth'?: string;
  '@_baseline'?: string;
  '@_shadowColor'?: string;
  '@_shadowOffset'?: string;
  '@_shadowBlurRadius'?: string;
  '@_kerning'?: string;
  '@_alignment'?: string;
  '@_lineSpacing'?: string;
  '@_tabStops'?: string;
  '@_baselineOffset'?: string;
  '@_underline'?: string;
};

type FCPAssetClipAttributes = FCPElementAttributes &
  FCPTimelineAttributes & {
    '@_srcEnable'?: string;
    '@_audioStart'?: string;
    '@_audioDuration'?: string;
    '@_modDate'?: string;
    '@_videoRole'?: string;
  };

// StoryElement
type FCPClipItems = {
  gap?: FCPGap[];
  clip?: FCPClip[];
  'asset-clip'?: FCPAssetClip[];
  title?: FCPTitle[];
  audio?: any;
  video?: any;
  'mc-clip'?: any;
  'ref-clip'?: any;
  'sync-clip'?: any;
  audition?: any;
};

type FCPAnchorItems = {
  spine?: FCPSpine[];
  clip?: FCPClip[];
  'asset-clip'?: FCPAssetClip[];
  title?: FCPTitle[];
  audio?: any;
  video?: any;
  'mc-clip'?: any;
  'ref-clip'?: any;
  'sync-clip'?: any;
  audition?: any;
  caption?: any;
};

type FCPMarkerItems = {
  marker: any;
  'chapter-marker': any;
  rating: any;
  keyword: any;
  'analysis-marker': any;
};

type FCPClip = FCPAssetClipAttributes &
  FCPClipItems &
  FCPMarkerItems & {
    '@_name': string;
    spine?: FCPSpine[];
    caption?: any;
    'audio-channel-source'?: {
      '@_srcCh': string;
      '@_outCh': string;
    }[];
  };

type FCPAssetClip = FCPAssetClipAttributes &
  FCPAnchorItems &
  FCPMarkerItems & {
    '@_ref': string;
    'audio-channel-source'?: any;
    'filter-audio'?: any;
    metadata?: any;
  };

type FCPSpine = FCPAnchorableAttributes &
  FCPClipItems & {
    '@_name': string;
    '@format': string;
    transition?: any;
  };

type FCPGap = FCPElementAttributes &
  FCPAnchorItems &
  FCPMarkerItems & {
    note?: any;
    metadata?: any;
  };

type FCPTitle = FCPElementAttributes &
  FCPAnchorItems &
  FCPMarkerItems & {
    '@_ref': string;
    '@_role'?: string;
    text: (FCPTextAttributes & {
      'text-style': (FCPTextStyleAttributes & {
        '@_ref': string;
        '#text': string;
      })[];
    })[];
    'text-style-def': {
      '@_id': string;
      'text-style': FCPTextStyleAttributes;
    }[];
    param: any;
    note: any;
    metadata?: any;
  };

type FCPXML = {
  fcpxml: {
    resources: any;
    'import-options'?: any;
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
            spine: FCPSpine;
            note?: any;
          };
        };
      };
    };
    'smart-collection': any;
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
  frameString: string = '0s',
  initialOffsetFrameString: string = '0s',
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
  const alwaysArray = ['gap', 'asset-clip', 'text-style', 'text', 'title'];

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

  const videoTitle = fcpData.fcpxml.library.event.project['@_name'];

  const gaps = fcpData.fcpxml.library.event.project.sequence.spine.gap ?? [];
  const assetClips =
    fcpData.fcpxml.library.event.project.sequence.spine['asset-clip'] ?? [];

  const elementsWithTitles = [...gaps, ...assetClips].filter(
    (element) => element.title !== undefined
  );

  if (elementsWithTitles.length === 0) {
    throw new Error('No titles found in the fcpxml file');
  }

  const subtitles: Subtitle[] = [];

  elementsWithTitles.forEach((element) => {
    const initialOffset = element['@_start'];
    const titles = element.title as FCPTitle[];
    titles.forEach((title) => {
      title.text.forEach((text) => {
        if (text['text-style'] !== undefined) {
          subtitles.push({
            ref: title['@_ref'],
            timelineIn: frameStringtoTimingString(
              title['@_offset'],
              initialOffset
            ),
            timelineOut: frameStringtoTimingString(
              title['@_offset'],
              initialOffset,
              title['@_duration']
            ),
            duration: frameStringtoTimingString(title['@_duration']),
            text: text['text-style']
              .reduce(
                (accumulator, currentValue) =>
                  (accumulator = accumulator + ' ' + currentValue['#text']),
                ''
              )
              .trim(),
          });
        }
      });
    });
  });

  const orderedSubtitles = subtitles.sort((a, b) => {
    return a.timelineIn.localeCompare(b.timelineIn);
  });

  return [videoTitle, orderedSubtitles];
}
