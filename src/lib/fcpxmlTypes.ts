type Time = string;

export interface FCPXML {
  '@_version'?: string;
  'import-options'?: ImportOptions;
  resources?: Resources;
  library?: Library;
  event?: Event[];
  clip?: Clip[];
  audition?: Audition[];
  'mc-clip'?: McClip[];
  'ref-clip'?: RefClip[];
  'sync-clip'?: SyncClip[];
  'asset-clip'?: AssetClip[];
  'collection-folder'?: CollectionFolder[];
  'keyword-collection'?: KeywordCollection[];
  'smart-collection'?: SmartCollection[];
  project?: Project;
}

interface ImportOptions {
  option?: Option[];
}

interface Option {
  '@_key': string;
  '@_value': string;
}

interface Library {
  '@_location'?: string;
  '@_colorProcessing'?: 'standard' | 'wide' | 'wide-hdr';
  event?: Event[];
  'smart-collection'?: SmartCollection[];
}

interface Event {
  '@_name'?: string;
  '@_uid'?: string;
  clip?: Clip[];
  audition?: Audition[];
  'mc-clip'?: McClip[];
  'ref-clip'?: RefClip[];
  'sync-clip'?: SyncClip[];
  'asset-clip'?: AssetClip[];
  'collection-folder'?: CollectionFolder[];
  'keyword-collection'?: KeywordCollection[];
  'smart-collection'?: SmartCollection[];
  project?: Project[];
}

interface Project {
  '@_name'?: string;
  '@_uid'?: string;
  '@_id'?: string;
  '@_modDate'?: string;
  sequence: Sequence;
}

interface Resources {
  asset?: Asset[];
  effect?: Effect[];
  format?: Format[];
  media?: Media[];
  locator?: Locator[];
}

interface Media {
  '@_id': string;
  '@_name'?: string;
  '@_uid'?: string;
  '@_projectRef'?: string;
  '@_modDate'?: string;
  multicam?: Multicam;
  sequence?: Sequence;
}

interface Format {
  '@_id': string;
  '@_name'?: string;
  '@_frameDuration'?: Time;
  '@_fieldOrder'?: string;
  '@_width'?: string;
  '@_height'?: string;
  '@_paspH'?: string;
  '@_paspV'?: string;
  '@_colorSpace'?: string;
  '@_projection'?: string;
  '@_stereoscopic'?: string;
}

interface Asset {
  '@_id': string;
  '@_name'?: string;
  '@_uid'?: string;
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_hasVideo'?: string;
  '@_format'?: string;
  '@_hasAudio'?: string;
  '@_videoSources'?: string;
  '@_audioSources'?: string;
  '@_audioChannels'?: string;
  '@_audioRate'?: string;
  '@_customLUTOverride'?: string;
  '@_colorSpaceOverride'?: string;
  '@_projectionOverride'?: string;
  '@_stereoscopicOverride'?: string;
  '@_auxVideoFlags'?: string;
  'media-rep'?: MediaRep[];
  metadata?: Metadata;
}

interface MediaRep {
  '@_kind'?: 'original-media' | 'proxy-media';
  '@_sig'?: string;
  '@_src': string;
  '@_suggestedFilename'?: string;
  bookmark?: string;
}

interface Metadata {
  md?: Md[];
}

interface Md {
  '@_key': string;
  '@_value'?: string;
  '@_editable'?: '0' | '1';
  '@_type'?: 'string' | 'boolean' | 'integer' | 'float' | 'date' | 'timecode';
  '@_displayName'?: string;
  '@_description'?: string;
  '@_source'?: string;
  array?: ArrayString;
}

interface ArrayString {
  string?: string[];
}

interface Effect {
  '@_id': string;
  '@_name'?: string;
  '@_uid': string;
  '@_src'?: string;
}

interface Locator {
  '@_id': string;
  '@_url': string;
  bookmark?: string;
}

interface Sequence {
  '@_format': string;
  '@_duration'?: Time;
  '@_tcStart'?: Time;
  '@_tcFormat'?: 'DF' | 'NDF';
  '@_audioLayout'?: 'mono' | 'stereo' | 'surround';
  '@_audioRate'?: string;
  '@_renderFormat'?: string;
  '@_keywords'?: string;
  note?: string;
  spine: Spine;
  metadata?: Metadata;
}

interface Multicam {
  'mc-angle'?: McAngle[];
  metadata?: Metadata;
}

interface McAngle {
  '@_name'?: string;
  '@_angleID': string;
  clip?: Clip[];
  transition?: Transition[];
}

interface McClip {
  '@_ref': string;
  '@_name'?: string;
  '@_duration': Time;
  '@_enabled'?: '0' | '1';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_start'?: Time;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'audio-role-source'?: AudioRoleSource[];
  'mc-source'?: McSource[];
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface McSource {
  '@_angleID': string;
  'audio-role-source'?: AudioRoleSource[];
  mask?: Mask[];
  filter?: FilterAudio[];
}

interface RefClip {
  '@_ref': string;
  '@_name'?: string;
  '@_duration': Time;
  '@_enabled'?: '0' | '1';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_start'?: Time;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  '@_useAudioSubroles'?: '0' | '1';
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'audio-role-source'?: AudioRoleSource[];
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface SyncClip {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_format'?: string;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_tcStart'?: Time;
  '@_tcFormat'?: 'DF' | 'NDF';
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  'sync-source'?: SyncSource[];
  metadata?: Metadata;
  spine?: Spine;
  clip?: Clip[];
  title?: Title[];
  audio?: Audio[];
  video?: Video[];
  caption?: Caption[];
  gap?: Gap[];
}

interface SyncSource {
  '@_sourceID': 'storyline' | 'connected';
  'audio-role-source'?: AudioRoleSource[];
}

interface AssetClip {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_ref': string;
  '@_format'?: string;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_tcStart'?: Time;
  '@_tcFormat'?: 'DF' | 'NDF';
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  '@_audioRole'?: string;
  '@_videoRole'?: string;
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'audio-channel-source'?: AudioChannelSource[];
  'audio-role-source'?: AudioRoleSource[];
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface Audio {
  '@_ref': string;
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_srcID'?: string;
  '@_role'?: string;
  '@_srcCh'?: string;
  '@_outCh'?: string;
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'adjust-volume'?: AdjustVolume;
  'adjust-loudness'?: AdjustLoudness;
  'adjust-noiseReduction'?: AdjustNoiseReduction;
  'adjust-humReduction'?: AdjustHumReduction;
  'adjust-EQ'?: AdjustEQ;
  'adjust-matchEQ'?: AdjustMatchEQ;
  mute?: Mute[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker;
  'filter-audio'?: FilterAudio[];
}

interface Video {
  '@_ref': string;
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_srcID'?: string;
  '@_role'?: string;
  param?: Param[];
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-video'?: FilterVideo[];
  'filter-video-mask'?: FilterVideoMask[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

export interface Title {
  '@_ref': string;
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_role'?: string;
  param?: Param[];
  text?: Text[];
  'text-style-def'?: TextStyleDef[];
  note?: string;
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-video'?: FilterVideo[];
  'filter-video-mask'?: FilterVideoMask[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface Caption {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_role'?: string;
  text?: Text[];
  'text-style-def'?: TextStyleDef[];
  note?: string;
}

interface Text {
  '@_display-style'?: 'pop-on' | 'paint-on' | 'roll-up';
  '@_roll-up-height'?: string;
  '@_position'?: string;
  '@_placement'?: 'left' | 'right' | 'top' | 'bottom';
  '@_alignment'?: 'left' | 'center' | 'right';
  '#text'?: string;
  'text-style'?: TextStyle[];
}

interface TextStyle {
  '@_ref'?: string;
  '@_font'?: string;
  '@_fontSize'?: string;
  '@_fontFace'?: string;
  '@_fontColor'?: string;
  '@_backgroundColor'?: string;
  '@_bold'?: '0' | '1';
  '@_italic'?: '0' | '1';
  '@_strokeColor'?: string;
  '@_strokeWidth'?: string;
  '@_baseline'?: string;
  '@_shadowColor'?: string;
  '@_shadowOffset'?: string;
  '@_shadowBlurRadius'?: string;
  '@_kerning'?: string;
  '@_alignment'?: 'left' | 'center' | 'right' | 'justified';
  '@_lineSpacing'?: string;
  '@_tabStops'?: string;
  '@_baselineOffset'?: string;
  '@_underline'?: '0' | '1';
  '#text'?: string;
  param?: Param[];
}

interface TextStyleDef {
  '@_id': string;
  '@_name'?: string;
  'text-style': TextStyle;
}

interface Gap {
  '@_name'?: string;
  '@_offset'?: Time;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '0' | '1';
  note?: string;
  clip?: Clip[];
  audio?: Audio[];
  video?: Video[];
  title?: Title[];
  'mc-clip'?: McClip[];
  'ref-clip'?: RefClip[];
  'sync-clip'?: SyncClip[];
  'asset-clip'?: AssetClip[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface Clip {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_format'?: string;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_tcStart'?: Time;
  '@_tcFormat'?: 'DF' | 'NDF';
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  spine?: Spine;
  audio?: Audio[];
  video?: Video[];
  title?: Title[];
  'mc-clip'?: McClip[];
  'ref-clip'?: RefClip[];
  'sync-clip'?: SyncClip[];
  'asset-clip'?: AssetClip[];
  caption?: Caption[];
  'audio-channel-source'?: AudioChannelSource[];
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface ConformRate {
  '@_scaleEnabled'?: '0' | '1';
  '@_srcFrameRate'?:
    | '23.98'
    | '24'
    | '25'
    | '29.97'
    | '30'
    | '60'
    | '47.95'
    | '48'
    | '50'
    | '59.94';
  '@_frameSampling'?:
    | 'floor'
    | 'nearest-neighbor'
    | 'frame-blending'
    | 'optical-flow-classic'
    | 'optical-flow';
}

interface TimeMap {
  '@_frameSampling'?:
    | 'floor'
    | 'nearest-neighbor'
    | 'frame-blending'
    | 'optical-flow-classic'
    | 'optical-flow';
  '@_preservesPitch'?: '0' | '1';
  timept?: TimePt[];
}

interface Mask {
  '@_enabled'?: '0' | '1';
  'mask-shape'?: MaskShape[];
  'mask-isolation'?: MaskIsolation[];
}

interface AudioChannelSource {
  '@_srcCh': string;
  '@_outCh'?: string;
  '@_role'?: string;
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_enabled'?: '0' | '1';
  '@_active'?: '0' | '1';
  'adjust-loudness'?: AdjustLoudness;
  'adjust-noiseReduction'?: AdjustNoiseReduction;
  'adjust-humReduction'?: AdjustHumReduction;
  'adjust-EQ'?: AdjustEQ;
  'adjust-matchEQ'?: AdjustMatchEQ;
  'adjust-volume'?: AdjustVolume;
  'adjust-panner'?: AdjustPanner;
  mute?: Mute[];
}

interface AudioRoleSource {
  '@_role': string;
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_enabled'?: '0' | '1';
  '@_active'?: '0' | '1';
  'adjust-loudness'?: AdjustLoudness;
  'adjust-noiseReduction'?: AdjustNoiseReduction;
  'adjust-humReduction'?: AdjustHumReduction;
  'adjust-EQ'?: AdjustEQ;
  'adjust-matchEQ'?: AdjustMatchEQ;
  'adjust-volume'?: AdjustVolume;
  'adjust-panner'?: AdjustPanner;
  mute?: Mute[];
}

interface Audition {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration': Time;
  '@_enabled'?: '1' | '0';
  '@_lane'?: string;
  '@_offset'?: Time;
  '@_format'?: string;
  '@_audioStart'?: Time;
  '@_audioDuration'?: Time;
  '@_tcStart'?: Time;
  '@_tcFormat'?: 'DF' | 'NDF';
  '@_modDate'?: string;
  '@_srcEnable'?: 'all' | 'audio' | 'video';
  note?: string;
  'conform-rate'?: ConformRate;
  timeMap?: TimeMap;
  'audio-role-source'?: AudioRoleSource[];
  'object-tracker'?: ObjectTracker;
  'adjust-crop'?: AdjustCrop;
  'adjust-corners'?: AdjustCorners;
  'adjust-conform'?: AdjustConform;
  'adjust-transform'?: AdjustTransform;
  'adjust-blend'?: AdjustBlend;
  'adjust-stabilization'?: AdjustStabilization;
  'adjust-rollingShutter'?: AdjustRollingShutter;
  'adjust-360-transform'?: Adjust360Transform;
  'adjust-reorient'?: AdjustReorient;
  'adjust-orientation'?: AdjustOrientation;
  'adjust-cinematic'?: AdjustCinematic;
  'filter-audio'?: FilterAudio[];
  'filter-video'?: FilterVideo[];
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
  'analysis-marker'?: AnalysisMarker[];
  metadata?: Metadata;
}

interface ObjectTracker {
  'tracking-shape'?: TrackingShape[];
}

interface AdjustCrop {
  '@_mode': 'trim' | 'crop' | 'pan';
  '@_enabled'?: '0' | '1';
  'crop-rect'?: CropRect;
  'trim-rect'?: TrimRect;
  'pan-rect'?: PanRect[];
}

interface AdjustCorners {
  '@_enabled'?: '0' | '1';
  '@_botLeft'?: string;
  '@_topLeft'?: string;
  '@_topRight'?: string;
  '@_botRight'?: string;
  param?: Param[];
}

interface AdjustConform {
  '@_type'?: 'fit' | 'fill' | 'none';
}

interface AdjustTransform {
  '@_enabled'?: '0' | '1';
  '@_position'?: string;
  '@_scale'?: string;
  '@_rotation'?: string;
  '@_anchor'?: string;
  '@_tracking'?: string;
  param?: Param[];
}

interface AdjustBlend {
  '@_amount'?: string;
  '@_mode'?: string;
  param?: Param[];
  reserved?: string;
}

interface AdjustStabilization {
  '@_enabled'?: '0' | '1';
  '@_type'?: 'automatic' | 'inertiaCam' | 'smoothCam';
  param?: Param[];
}

interface AdjustRollingShutter {
  '@_enabled'?: '0' | '1';
  '@_amount'?: 'none' | 'low' | 'medium' | 'high' | 'extraHigh';
}

interface Adjust360Transform {
  '@_enabled'?: '0' | '1';
  '@_coordinates': 'spherical' | 'cartesian';
  '@_latitude'?: string;
  '@_longitude'?: string;
  '@_distance'?: string;
  '@_xPosition'?: string;
  '@_yPosition'?: string;
  '@_zPosition'?: string;
  '@_xOrientation'?: string;
  '@_yOrientation'?: string;
  '@_zOrientation'?: string;
  '@_autoOrient'?: '0' | '1';
  '@_convergence'?: string;
  '@_interaxial'?: string;
  '@_scale'?: string;
  param?: Param[];
}

interface AdjustReorient {
  '@_enabled'?: '0' | '1';
  '@_tilt'?: string;
  '@_pan'?: string;
  '@_roll'?: string;
  '@_convergence'?: string;
  param?: Param[];
}

interface AdjustOrientation {
  '@_enabled'?: '0' | '1';
  '@_tilt'?: string;
  '@_pan'?: string;
  '@_roll'?: string;
  '@_fieldOfView'?: string;
  '@_mapping'?: 'normal' | 'tinyPlanet';
  param?: Param[];
}

interface AdjustCinematic {
  '@_enabled'?: '0' | '1';
  '@_dataLocator'?: string;
  '@_aperture'?: string;
  param?: Param[];
}

interface FilterAudio {
  '@_ref': string;
  '@_name'?: string;
  '@_enabled'?: '0' | '1';
  '@_presetID'?: string;
  data?: Data;
  param?: Param[];
}

interface FilterVideo {
  '@_ref': string;
  '@_name'?: string;
  '@_enabled'?: '0' | '1';
  data?: Data[];
  param?: Param[];
}

interface FilterVideoMask {
  '@_enabled'?: '0' | '1';
  '@_inverted'?: '0' | '1';
  'mask-shape'?: MaskShape[];
  'mask-isolation'?: MaskIsolation[];
  'filter-video'?: FilterVideo[];
}

interface MaskShape {
  '@_name'?: string;
  '@_enabled'?: '0' | '1';
  '@_blendMode'?: 'add' | 'subtract' | 'multiply';
  '@_tracking'?: string;
  param?: Param[];
}

interface MaskIsolation {
  '@_name'?: string;
  '@_enabled'?: '0' | '1';
  '@_blendMode'?: 'add' | 'subtract' | 'multiply';
  '@_type'?: '3D' | 'HSL';
  data?: Data;
  param?: Param[];
}

interface Spine {
  '@_name'?: string;
  '@_format'?: string;
  clip?: Clip[];
  audio?: Audio[];
  video?: Video[];
  title?: Title[];
  'mc-clip'?: McClip[];
  'ref-clip'?: RefClip[];
  'sync-clip'?: SyncClip[];
  'asset-clip'?: AssetClip[];
  transition?: Transition[];
  caption?: Caption[];
  gap?: Gap[];
}

interface Transition {
  '@_name'?: string;
  '@_offset'?: Time;
  '@_duration': Time;
  'filter-video'?: FilterVideo;
  'filter-audio'?: FilterAudio;
  bookmark?: string;
  marker?: Marker[];
  'chapter-marker'?: ChapterMarker[];
  rating?: Rating[];
  keyword?: Keyword[];
}

interface Marker {
  '@_start': Time;
  '@_duration'?: Time;
  '@_value': string;
  '@_completed'?: string;
  '@_note'?: string;
}

interface ChapterMarker {
  '@_start': Time;
  '@_duration'?: Time;
  '@_value': string;
  '@_note'?: string;
  '@_posterOffset'?: Time;
}

interface Rating {
  '@_name'?: string;
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_value': 'favorite' | 'reject';
  '@_note'?: string;
}

interface Keyword {
  '@_start'?: Time;
  '@_duration'?: Time;
  '@_value': string;
  '@_note'?: string;
}

interface AnalysisMarker {
  '@_start'?: Time;
  '@_duration'?: Time;
  'shot-type'?: ShotType[];
  'stabilization-type'?: StabilizationType[];
}

interface ShotType {
  '@_value':
    | 'onePerson'
    | 'twoPersons'
    | 'group'
    | 'closeUp'
    | 'mediumShot'
    | 'wideShot';
}

interface StabilizationType {
  '@_value': 'excessiveShake';
}

interface CollectionFolder {
  '@_name': string;
  'collection-folder'?: CollectionFolder[];
  'keyword-collection'?: KeywordCollection[];
  'smart-collection'?: SmartCollection[];
}

interface KeywordCollection {
  '@_name': string;
}

interface SmartCollection {
  '@_name': string;
  '@_match': 'any' | 'all';
  'match-text'?: MatchText;
  'match-ratings'?: MatchRatings;
  'match-media'?: MatchMedia;
  'match-clip'?: MatchClip;
  'match-stabilization'?: MatchStabilization;
  'match-keywords'?: MatchKeywords;
  'match-shot'?: MatchShot;
  'match-property'?: MatchProperty;
  'match-time'?: MatchTime;
  'match-timerange'?: MatchTimeRange;
  'match-roles'?: MatchRoles;
  'match-usage'?: MatchUsage;
  'match-representation'?: MatchRepresentation;
  'match-markers'?: MatchMarkers;
}

interface MatchText {
  '@_enabled'?: '0' | '1';
  '@_rule'?: 'includes' | 'doesNotInclude' | 'is' | 'isNot';
  '@_value': string;
  '@_scope'?: 'all' | 'notes' | 'names' | 'markers';
}

interface MatchRatings {
  '@_enabled'?: '0' | '1';
  '@_value': 'favorites' | 'rejected';
}

interface MatchMedia {
  '@_enabled'?: '0' | '1';
  '@_rule'?: 'is' | 'isNot';
  '@_type': 'videoWithAudio' | 'videoOnly' | 'audioOnly' | 'stills';
}

interface MatchClip {
  '@_enabled'?: '0' | '1';
  '@_rule'?: 'is' | 'isNot';
  '@_type':
    | 'audition'
    | 'synchronized'
    | 'compound'
    | 'multicam'
    | 'layeredGraphic'
    | 'project';
}

interface MatchStabilization {
  '@_enabled'?: '0' | '1';
  '@_rule'?:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  'stabilization-type'?: StabilizationType[];
}

interface MatchKeywords {
  '@_enabled'?: '0' | '1';
  '@_rule'?:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  'keyword-name'?: KeywordName[];
}

interface KeywordName {
  '@_value': string;
}

interface MatchShot {
  '@_enabled'?: '0' | '1';
  '@_rule'?:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  'shot-type'?: ShotType[];
}

interface MatchProperty {
  '@_enabled'?: '0' | '1';
  '@_key':
    | 'reel'
    | 'scene'
    | 'take'
    | 'audioOutputChannels'
    | 'frameSize'
    | 'videoFrameRate'
    | 'audioSampleRate'
    | 'cameraName'
    | 'cameraAngle'
    | 'projection'
    | 'stereoscopic'
    | 'cinematic';
  '@_rule':
    | 'includes'
    | 'doesNotInclude'
    | 'is'
    | 'isNot'
    | 'isSet'
    | 'isNotSet';
  '@_value'?: string;
}

interface MatchTime {
  '@_enabled'?: '0' | '1';
  '@_type': 'contentCreated' | 'dateImported';
  '@_rule': 'is' | 'isBefore' | 'isAfter';
  '@_value': string;
}

interface MatchTimeRange {
  '@_enabled'?: '0' | '1';
  '@_type': 'contentCreated' | 'dateImported';
  '@_rule': 'isInLast' | 'isNotInLast';
  '@_value': string;
  '@_units'?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

interface MatchRoles {
  '@_enabled'?: '0' | '1';
  '@_rule'?:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  role?: Role[];
}

interface Role {
  '@_name': string;
}

interface MatchUsage {
  '@_enabled'?: '0' | '1';
  '@_rule': 'used' | 'unused';
}

interface MatchRepresentation {
  '@_enabled'?: '0' | '1';
  '@_type': 'original' | 'optimized' | 'proxy';
  '@_rule': 'isAvailable' | 'isMissing';
}

interface MatchMarkers {
  '@_enabled'?: '0' | '1';
  '@_type'?: 'all' | 'standard' | 'allTodo' | 'complete' | 'incomplete';
}

interface TrackingShape {
  '@_id': string;
  '@_name'?: string;
  '@_offsetEnabled'?: '0' | '1';
  '@_analysisMethod'?:
    | 'automatic'
    | 'combined'
    | 'machineLearning'
    | 'pointCloud';
  '@_dataLocator'?: string;
}

interface Data {
  '@_key'?: string;
  '#text'?: string;
}

interface Param {
  '@_name': string;
  '@_key'?: string;
  '@_value'?: string;
  '@_enabled'?: '1' | '0';
  fadeIn?: FadeIn;
  fadeOut?: FadeOut;
  keyframeAnimation?: KeyframeAnimation;
  param?: Param[];
}

interface FadeIn {
  '@_type'?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  '@_duration': Time;
}

interface FadeOut {
  '@_type'?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  '@_duration': Time;
}

interface KeyframeAnimation {
  keyframe?: Keyframe[];
}

interface Keyframe {
  '@_time': Time;
  '@_value': string;
  '@_interp'?: 'linear' | 'ease' | 'easeIn' | 'easeOut';
  '@_curve'?: 'linear' | 'smooth';
}

interface CropRect {
  '@_left'?: string;
  '@_top'?: string;
  '@_right'?: string;
  '@_bottom'?: string;
  param?: Param[];
}

interface TrimRect {
  '@_left'?: string;
  '@_top'?: string;
  '@_right'?: string;
  '@_bottom'?: string;
  param?: Param[];
}

interface PanRect {
  '@_left'?: string;
  '@_top'?: string;
  '@_right'?: string;
  '@_bottom'?: string;
}

interface AdjustVolume {
  '@_amount'?: string;
  param?: Param[];
}

interface Mute {
  '@_start'?: Time;
  '@_duration'?: Time;
  fadeIn?: FadeIn;
  fadeOut?: FadeOut;
}

interface AdjustLoudness {
  '@_amount': string;
  '@_uniformity': string;
}

interface AdjustNoiseReduction {
  '@_amount': string;
}

interface AdjustHumReduction {
  '@_frequency': '50' | '60';
}

interface AdjustEQ {
  '@_mode':
    | 'flat'
    | 'voice_enhance'
    | 'music_enhance'
    | 'loudness'
    | 'hum_reduction'
    | 'bass_boost'
    | 'bass_reduce'
    | 'treble_boost'
    | 'treble_reduce';
  param?: Param[];
}

interface AdjustMatchEQ {
  data: Data;
}

interface AdjustPanner {
  '@_mode'?: string;
  '@_amount'?: string;
  '@_original_decoded_mix'?: string;
  '@_ambient_direct_mix'?: string;
  '@_surround_width'?: string;
  '@_left_right_mix'?: string;
  '@_front_back_mix'?: string;
  '@_LFE_balance'?: string;
  '@_rotation'?: string;
  '@_stereo_spread'?: string;
  '@_attenuate_collapse_mix'?: string;
  '@_center_balance'?: string;
  param?: Param[];
}

interface TimePt {
  '@_time': Time;
  '@_value': string;
  '@_interp'?: 'smooth2' | 'linear' | 'smooth';
  '@_inTime'?: Time;
  '@_outTime'?: Time;
}
