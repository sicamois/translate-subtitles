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

export type FCPTitle = FCPElementAttributes &
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
      'text-style': FCPTextStyleAttributes[];
    }[];
    param: any;
    note: any;
    metadata?: any;
  };

export type FCPXML = {
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
          sequence: FCPTimelineAttributes & {
            spine: FCPSpine;
            note?: any;
          };
        };
      };
    };
    'smart-collection': any;
  };
};
