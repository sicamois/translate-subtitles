// Helper Types
type Time = string; // e.g., "1001/30000s" or "5s"
type Timelist = string; // e.g., a semicolon-separated list of time values
type MdType = 'string' | 'boolean' | 'integer' | 'float' | 'date' | 'timecode';
type FadeType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
type OutputChannel = 'L' | 'R' | 'C' | 'LFE' | 'Ls' | 'Rs' | 'X';
type AudioHz = '32k' | '44.1k' | '48k' | '88.2k' | '96k' | '176.4k' | '192k';
type ColorSpace =
  | 'Rec. 601 (NTSC)'
  | 'Rec. 601 (PAL)'
  | 'Rec. 709'
  | 'sRGB IEC61966-2.1'
  | 'Adobe RGB (1998)'
  | 'Rec. 2020';

// Common Attributes
interface CommonAttrs {
  lane?: string;
  offset?: Time;
}

interface ClipAttrs extends CommonAttrs {
  name?: string;
  start?: Time;
  duration?: Time;
  enabled?: '0' | '1';
}

interface ClipAttrsWithOptionalDuration extends CommonAttrs {
  name?: string;
  start?: Time;
  duration?: Time;
  enabled?: '0' | '1';
}

interface MediaAttrs {
  format: string;
  duration?: Time;
  tcStart?: Time;
  tcFormat?: 'DF' | 'NDF';
}

// Elements
interface Fcpxml {
  version: string;
  importOptions?: ImportOptions;
  resources?: Resources;
  library?: Library;
  events?: Event[];
  eventItems?: EventItem[];
}

interface ImportOptions {
  options?: Option[];
}

interface Option {
  key: string;
  value: string;
}

interface Library {
  events?: Event[];
  smartCollections?: SmartCollection[];
  location?: string;
  colorProcessing?: 'standard' | 'wide';
}

interface Event {
  name?: string;
  uid?: string;
  items?: EventItem[];
}

type EventItem =
  | Clip
  | Audition
  | McClip
  | RefClip
  | SyncClip
  | AssetClip
  | Project
  | CollectionItem;

interface Project {
  sequence: Sequence;
  name?: string;
  uid?: string;
  id?: string;
  modDate?: string;
}

interface Resources {
  assets?: Asset[];
  effects?: Effect[];
  formats?: Format[];
  medias?: Media[];
}

interface Media extends MediaAttrs {
  id: string;
  name?: string;
  uid?: string;
  projectRef?: string;
  modDate?: string;
  multicam?: Multicam;
  sequence?: Sequence;
}

interface Format {
  id: string;
  name?: string;
  frameDuration?: Time;
  fieldOrder?: string;
  width?: string;
  height?: string;
  paspH?: string;
  paspV?: string;
}

interface Asset {
  id: string;
  name?: string;
  uid?: string;
  src: string;
  start?: Time;
  duration?: Time;
  hasVideo?: string;
  format?: string;
  hasAudio?: string;
  audioSources?: string;
  audioChannels?: string;
  audioRate?: string;
  customLogOverride?: string;
  colorSpaceOverride?: ColorSpace;
  bookmark?: Bookmark;
  metadata?: Metadata;
}

interface Bookmark {
  value: string;
}

interface Metadata {
  md: Md[];
}

interface Md {
  key: string;
  value?: string;
  editable?: '0' | '1';
  type?: MdType;
  displayName?: string;
  description?: string;
  source?: string;
}

interface Effect {
  id: string;
  name?: string;
  uid: string;
  src?: string;
}

interface Sequence extends MediaAttrs {
  note?: Note;
  spine: Spine;
  metadata?: Metadata;
  audioLayout?: 'mono' | 'stereo' | 'surround';
  audioRate?: AudioHz;
  renderFormat?: string;
  keywords?: string;
  renderColorSpace?: ColorSpace;
}

interface Note {
  value: string;
}

interface Audition extends CommonAttrs {
  modDate?: string;
  items: AuditionItem[];
}

type AuditionItem =
  | Audio
  | Video
  | Title
  | RefClip
  | AssetClip
  | Clip
  | SyncClip;

interface Clip extends ClipAttrs {
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParams?: IntrinsicParams;
  spine?: Spine;
  items?: ClipItem[];
  markers?: MarkerItem[];
  audioChannelSources?: AudioChannelSource[];
  videoFilters?: VideoFilter[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
  format?: string;
  audioStart?: Time;
  audioDuration?: Time;
  tcStart?: Time;
  tcFormat?: 'DF' | 'NDF';
  modDate?: string;
}

// McClip Type
interface McClip extends ClipAttrs {
  ref: string; // 'media' ID
  srcEnable?: 'all' | 'audio' | 'video';
  audioStart?: Time;
  audioDuration?: Time;
  modDate?: string;
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParamsAudio?: IntrinsicParamsAudio;
  mcSources?: McSource[];
  anchorItems?: AnchorItem[];
  markers?: MarkerItem[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
}

// McSource Type
interface McSource {
  angleID: string; // Required attribute
  srcEnable?: 'all' | 'audio' | 'video' | 'none';
  audioRoleSources?: AudioRoleSource[];
  intrinsicParamsVideo?: IntrinsicParamsVideo;
  videoFilters?: VideoFilterItem[];
}

// FilterVideo Type
interface FilterVideo {
  ref: string; // Required 'effect' ID
  name?: string; // Optional name
  enabled?: '0' | '1'; // Optional enabled attribute with default "1"
  infoAscCdl?: InfoAscCdl; // Optional ASC CDL info
  data?: Data; // Optional data element
  params?: Param[]; // Optional list of params
}

// VideoFilterItem Type
type VideoFilterItem = FilterVideo | FilterVideoMask;

interface RefClip extends ClipAttrs {
  ref: string;
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParams?: IntrinsicParams;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  audioRoleSources?: AudioRoleSource[];
  videoFilters?: VideoFilter[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
  srcEnable?: 'all' | 'audio' | 'video';
  audioStart?: Time;
  audioDuration?: Time;
  useAudioSubroles?: '0' | '1';
  modDate?: string;
}

interface SyncClip extends ClipAttrs {
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParams?: IntrinsicParams;
  spine?: Spine;
  items?: ClipItem[];
  markers?: MarkerItem[];
  syncSources?: SyncSource[];
  videoFilters?: VideoFilter[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
  format?: string;
  audioStart?: Time;
  audioDuration?: Time;
  tcStart?: Time;
  tcFormat?: 'DF' | 'NDF';
  modDate?: string;
}

interface AssetClip extends ClipAttrsWithOptionalDuration {
  ref: string;
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParams?: IntrinsicParams;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  audioChannelSources?: AudioChannelSource[];
  videoFilters?: VideoFilter[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
  srcEnable?: 'all' | 'audio' | 'video';
  audioStart?: Time;
  audioDuration?: Time;
  format?: string;
  tcStart?: Time;
  tcFormat?: 'DF' | 'NDF';
  modDate?: string;
  audioRole?: string;
  videoRole?: string;
}

interface Audio extends ClipAttrs {
  note?: Note;
  timingParams?: TimingParams;
  adjustVolume?: AdjustVolume;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  filterAudios?: FilterAudio[];
  ref: string;
  srcID?: string;
  role?: string;
  srcCh?: string;
  outCh?: string;
}

interface Video extends ClipAttrs {
  params?: Param[];
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParamsVideo?: IntrinsicParamsVideo;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  videoFilters?: VideoFilter[];
  reserved?: Reserved;
  ref: string;
  srcID?: string;
  role?: string;
}

interface Gap extends ClipAttrs {
  note?: Note;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  metadata?: Metadata;
}

interface Title extends ClipAttrs {
  params?: Param[];
  texts?: Text[];
  textStyles?: TextStyleDef[];
  note?: Note;
  intrinsicParamsVideo?: IntrinsicParamsVideo;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  videoFilters?: VideoFilter[];
  metadata?: Metadata;
  ref: string;
  role?: string;
}

interface Text {
  value: string;
  textStyles?: TextStyle[];
}

interface TextStyle {
  ref?: string;
  font?: string;
  fontSize?: string;
  fontFace?: string;
  fontColor?: string;
  bold?: '0' | '1';
  italic?: '0' | '1';
  strokeColor?: string;
  strokeWidth?: string;
  baseline?: string;
  shadowColor?: string;
  shadowOffset?: string;
  shadowBlurRadius?: string;
  kerning?: string;
  alignment?: 'left' | 'center' | 'right' | 'justified';
  lineSpacing?: string;
  tabStops?: string;
  baselineOffset?: string;
}

interface TextStyleDef {
  id: string;
  name?: string;
  textStyle: TextStyle;
}

interface Transition extends ClipAttrs {
  name?: string;
  offset?: Time;
  videoFilter?: VideoFilter;
  filterAudio?: FilterAudio;
  markers?: MarkerItem[];
  metadata?: Metadata;
  reserved?: Reserved;
  duration: Time;
}

interface VideoFilter {
  ref: string;
  name?: string;
  enabled?: '0' | '1';
  params?: Param[];
  data?: Data;
  infoAscCdl?: InfoAscCdl;
}

interface Data {
  key?: string;
  value: string;
}

interface InfoAscCdl {
  slope: string;
  offset: string;
  power: string;
}

interface FilterAudio {
  ref: string;
  name?: string;
  enabled?: '0' | '1';
  presetID?: string;
  params: Param[];
  data?: Data;
}

interface ConformRate {
  scaleEnabled?: '0' | '1';
  srcFrameRate?: string;
  frameSampling?:
    | 'floor'
    | 'nearest-neighbor'
    | 'frame-blending'
    | 'optical-flow-classic'
    | 'optical-flow';
}

interface TimeMap {
  frameSampling?:
    | 'floor'
    | 'nearest-neighbor'
    | 'frame-blending'
    | 'optical-flow-classic'
    | 'optical-flow';
  preservesPitch?: '0' | '1';
  timepts: Timept[];
}

interface Timept {
  time: Time;
  value: string;
  interp?: 'smooth2' | 'linear' | 'smooth';
  inTime?: Time;
  outTime?: Time;
}

interface Marker {
  start: Time;
  duration?: Time;
  value: string;
  completed?: string;
  note?: string;
}

interface Rating {
  value: 'favorite' | 'reject';
  name?: string;
  start?: Time;
  duration?: Time;
  note?: string;
}

interface Keyword {
  value: string;
  start?: Time;
  duration?: Time;
  note?: string;
}

interface AnalysisMarker {
  start?: Time;
  duration?: Time;
  shotType?: ShotType[];
  stabilizationType?: StabilizationType[];
}

interface KeywordCollection {
  name: string;
}

interface CollectionFolder {
  name: string;
  items?: CollectionItem[];
}

type CollectionItem = CollectionFolder | KeywordCollection | SmartCollection;

interface SmartCollection {
  name: string;
  match: 'any' | 'all';
  matches?: Match[];
}

type Match =
  | MatchText
  | MatchRatings
  | MatchMedia
  | MatchClip
  | MatchStabilization
  | MatchKeywords
  | MatchShot
  | MatchProperty
  | MatchTime
  | MatchTimeRange
  | MatchRoles;

interface MatchText {
  enabled?: '0' | '1';
  rule: 'includes' | 'doesNotInclude' | 'is' | 'isNot';
  value: string;
}

interface MatchRatings {
  enabled?: '0' | '1';
  value: 'favorites' | 'rejected';
}

interface MatchMedia {
  enabled?: '0' | '1';
  rule: 'is' | 'isNot';
  type: 'videoWithAudio' | 'videoOnly' | 'audioOnly' | 'stills';
}

interface MatchClip {
  enabled?: '0' | '1';
  rule: 'is' | 'isNot';
  type:
    | 'audition'
    | 'synchronized'
    | 'compound'
    | 'multicam'
    | 'layeredGraphic'
    | 'project';
}

interface MatchStabilization {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  types?: StabilizationType[];
}

interface StabilizationType {
  value: string;
}

interface MatchKeywords {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  keywordNames?: KeywordName[];
}

interface KeywordName {
  value: string;
}

interface MatchShot {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  shotTypes?: ShotType[];
}

interface ShotType {
  value:
    | 'onePerson'
    | 'twoPersons'
    | 'group'
    | 'closeUp'
    | 'mediumShot'
    | 'wideShot';
}

interface MatchProperty {
  enabled?: '0' | '1';
  key:
    | 'reel'
    | 'scene'
    | 'take'
    | 'audioOutputChannels'
    | 'frameSize'
    | 'videoFrameRate'
    | 'audioSampleRate'
    | 'cameraName'
    | 'cameraAngle';
  rule: 'includes' | 'doesNotInclude' | 'is' | 'isNot';
  value: string;
}

interface MatchTime {
  enabled?: '0' | '1';
  type: 'contentCreated' | 'dateImported';
  rule: 'is' | 'isBefore' | 'isAfter';
  value: string;
}

interface MatchTimeRange {
  enabled?: '0' | '1';
  type: 'contentCreated' | 'dateImported';
  rule: 'isInLast' | 'isNotInLast';
  value: string;
  units?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

interface MatchRoles {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  roles?: Role[];
}

interface Role {
  name: string;
}

interface ChapterMarker {
  start: Time;
  value: string;
  duration?: Time;
  note?: string;
  posterOffset?: Time;
}

interface Reserved {
  value: string;
}

interface Param {
  name: string;
  key?: string;
  value?: string;
  enabled?: '0' | '1';
}

interface AdjustCrop {
  mode: 'trim' | 'crop' | 'pan';
  cropRect?: CropRect;
  trimRect?: TrimRect;
  panRect?: PanRect[];
  enabled?: '0' | '1';
}

interface CropRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  params?: Param[];
}

interface TrimRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  params?: Param[];
}

interface PanRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}

interface AdjustCorners {
  enabled?: '0' | '1';
  botLeft?: string;
  topLeft?: string;
  topRight?: string;
  botRight?: string;
  params?: Param[];
}

interface AdjustConform {
  type: 'fit' | 'fill' | 'none';
}

interface AdjustTransform {
  enabled?: '0' | '1';
  position?: string;
  scale?: string;
  rotation?: string;
  anchor?: string;
  params?: Param[];
}

interface AdjustBlend {
  amount: string;
  mode?: string;
  params?: Param[];
  reserved?: Reserved;
}

interface AdjustStabilization {
  type: 'automatic' | 'inertiaCam' | 'smoothCam';
  params?: Param[];
}

interface AdjustRollingShutter {
  amount: 'none' | 'low' | 'medium' | 'high' | 'extraHigh';
}

interface AdjustLoudness {
  amount: string;
  uniformity: string;
}

interface AdjustNoiseReduction {
  amount: string;
}

interface AdjustHumReduction {
  frequency: '50' | '60';
}

interface AdjustEQ {
  mode:
    | 'flat'
    | 'voice_enhance'
    | 'music_enhance'
    | 'loudness'
    | 'hum_reduction'
    | 'bass_boost'
    | 'bass_reduce'
    | 'treble_boost'
    | 'treble_reduce';
  params?: Param[];
}

interface AdjustMatchEQ {
  data: Data;
}

type AudioEnhancements = {
  adjustLoudness?: AdjustLoudness;
  adjustNoiseReduction?: AdjustNoiseReduction;
  adjustHumReduction?: AdjustHumReduction;
  adjustEQ?: AdjustEQ | AdjustMatchEQ;
};

interface AdjustVolume {
  amount: string;
  params?: Param[];
}

interface AdjustPanner {
  mode?: string;
  amount: string;
  originalDecodedMix?: string;
  ambientDirectMix?: string;
  surroundWidth?: string;
  leftRightMix?: string;
  frontBackMix?: string;
  LFEBalance?: string;
  rotation?: string;
  stereoSpread?: string;
  attenuateCollapseMix?: string;
  centerBalance?: string;
  params?: Param[];
}

type IntrinsicParamsVideo = {
  adjustCrop?: AdjustCrop;
  adjustCorners?: AdjustCorners;
  adjustConform?: AdjustConform;
  adjustTransform?: AdjustTransform;
  adjustBlend?: AdjustBlend;
  adjustStabilization?: AdjustStabilization;
  adjustRollingShutter?: AdjustRollingShutter;
};

type IntrinsicParamsAudio = {
  adjustVolume?: AdjustVolume;
  adjustPanner?: AdjustPanner;
};

type IntrinsicParams = IntrinsicParamsVideo & IntrinsicParamsAudio;

type TimingParams = {
  conformRate?: ConformRate;
  timeMap?: TimeMap;
};

interface AnchorItem extends Clip {}

// Audio source elements
interface AudioChannelSource extends AudioEnhancements, IntrinsicParamsAudio {
  srcCh: string;
  outCh?: string;
  role?: string;
  start?: Time;
  duration?: Time;
  enabled?: '0' | '1';
  active?: '0' | '1';
  filterAudios?: FilterAudio[];
  mute?: Mute;
}

interface AudioRoleSource extends AudioEnhancements, IntrinsicParamsAudio {
  role: string;
  start?: Time;
  duration?: Time;
  enabled?: '0' | '1';
  active?: '0' | '1';
  filterAudios?: FilterAudio[];
  mute?: Mute;
}

// Miscellaneous elements
interface Mute {
  start?: Time;
  duration?: Time;
  fadeIn?: FadeIn;
  fadeOut?: FadeOut;
}

interface FadeIn {
  type?: FadeType;
  duration: Time;
}

interface FadeOut {
  type?: FadeType;
  duration: Time;
}

// Story elements
interface Spine extends CommonAttrs {
  name?: string;
  format?: string;
  items: (ClipItem | Transition)[];
}

// Note that ref-clip, sync-clip, and asset-clip are already defined in previous parts of the code
type ClipItem =
  | Audio
  | Video
  | Clip
  | Title
  | McClip
  | RefClip
  | SyncClip
  | AssetClip
  | Audition
  | Gap;

// Smart Collection
interface SmartCollection {
  name: string;
  match: 'any' | 'all';
  matches?: Match[];
}

// Marker Item Types
interface Marker {
  start: Time;
  duration?: Time;
  value: string;
  completed?: string;
  note?: string;
}

interface Rating {
  start?: Time;
  duration?: Time;
  value: 'favorite' | 'reject';
  note?: string;
}

interface Keyword {
  start?: Time;
  duration?: Time;
  value: string;
  note?: string;
}

interface AnalysisMarker {
  start?: Time;
  duration?: Time;
  shotType?: ShotType[];
  stabilizationType?: StabilizationType[];
}

interface ChapterMarker {
  start: Time;
  duration?: Time;
  value: string;
  note?: string;
  posterOffset?: Time;
}

// ShotType Interface
interface ShotType {
  value:
    | 'onePerson'
    | 'twoPersons'
    | 'group'
    | 'closeUp'
    | 'mediumShot'
    | 'wideShot';
}

// MarkerItem Union Type
type MarkerItem = Marker | Rating | Keyword | AnalysisMarker | ChapterMarker;

// Mask items for filter-video-mask
type MaskItem = MaskShape | MaskIsolation;

// Filter video mask
interface FilterVideoMask {
  items: MaskItem[];
  videoFilters: [VideoFilter, VideoFilter?]; // Tuple length 1 or 2
  enabled?: '0' | '1';
  inverted?: '0' | '1';
}

// Mask shape
interface MaskShape {
  name?: string;
  enabled?: '0' | '1';
  blendMode?: 'add' | 'subtract' | 'multiply';
  params?: Param[];
}

// Mask isolation
interface MaskIsolation {
  name?: string;
  enabled?: '0' | '1';
  blendMode?: 'add' | 'subtract' | 'multiply';
  data: Data;
  params?: Param[];
}

// Multicam and multicam angles
interface Multicam extends MediaAttrs {
  angles: McAngle[];
  metadata?: Metadata;
  renderFormat?: string;
  renderColorSpace?: ColorSpace;
}

interface McAngle {
  name?: string;
  angleID: string;
  items: (ClipItem | Transition)[];
}

// Ref clip
interface RefClip extends ClipAttrs {
  ref: string;
  srcEnable?: 'all' | 'audio' | 'video';
  audioStart?: Time;
  audioDuration?: Time;
  format?: string;
  useAudioSubroles?: '0' | '1';
  note?: Note;
  timingParams?: TimingParams;
  intrinsicParams?: IntrinsicParams;
  items?: AnchorItem[];
  markers?: MarkerItem[];
  audioRoleSources?: AudioRoleSource[];
  videoFilters?: VideoFilter[];
  filterAudios?: FilterAudio[];
  metadata?: Metadata;
}

// Sync source for sync-clip
interface SyncSource {
  sourceID: 'storyline' | 'connected';
  audioRoleSources: AudioRoleSource[];
}

// Remaining elements
interface ChapterMarker {
  start: Time;
  value: string;
  duration?: Time;
  note?: string;
  posterOffset?: Time;
}

interface Rating {
  name?: string;
  value: 'favorite' | 'reject';
  start?: Time;
  duration?: Time;
  note?: string;
}

interface Marker {
  start: Time;
  value: string;
  duration?: Time;
  completed?: string;
  note?: string;
}

interface Keyword {
  value: string;
  start?: Time;
  duration?: Time;
  note?: string;
}

interface AnalysisMarker {
  start?: Time;
  duration?: Time;
  shotType?: ShotType[];
  stabilizationType?: StabilizationType[];
}

// Analysis marker related definitions
interface ShotType {
  value:
    | 'onePerson'
    | 'twoPersons'
    | 'group'
    | 'closeUp'
    | 'mediumShot'
    | 'wideShot';
}

// Adjustments
interface AdjustCrop {
  mode: 'trim' | 'crop' | 'pan';
  enabled?: '0' | '1';
  cropRect?: CropRect;
  trimRect?: TrimRect;
  panRects?: [PanRect, PanRect?];
}

interface CropRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  params?: Param[];
}

interface TrimRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  params?: Param[];
}

interface PanRect {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}

interface AdjustCorners {
  enabled?: '0' | '1';
  botLeft?: string;
  topLeft?: string;
  topRight?: string;
  botRight?: string;
  params?: Param[];
}

interface AdjustConform {
  type: 'fit' | 'fill' | 'none';
}

interface AdjustTransform {
  enabled?: '0' | '1';
  position?: string;
  scale?: string;
  rotation?: string;
  anchor?: string;
  params?: Param[];
}

interface AdjustBlend {
  amount: string;
  mode?: string;
  params?: Param[];
  reserved?: Reserved;
}

interface AdjustStabilization {
  type: 'automatic' | 'inertiaCam' | 'smoothCam';
  params?: Param[];
}

interface AdjustRollingShutter {
  amount: 'none' | 'low' | 'medium' | 'high' | 'extraHigh';
}

interface AdjustVolume {
  amount: string;
  params?: Param[];
}

interface AdjustNoiseReduction {
  amount: string;
}

interface AdjustLoudness {
  amount: string;
  uniformity: string;
}

interface Mute {
  fadeIn?: FadeIn;
  fadeOut?: FadeOut;
  start?: Time;
  duration?: Time;
}

interface FadeIn {
  type?: FadeType;
  duration: Time;
}

interface FadeOut {
  type?: FadeType;
  duration: Time;
}

interface AdjustEQ {
  mode:
    | 'flat'
    | 'voice_enhance'
    | 'music_enhance'
    | 'loudness'
    | 'hum_reduction'
    | 'bass_boost'
    | 'bass_reduce'
    | 'treble_boost'
    | 'treble_reduce';
  params?: Param[];
}

interface AdjustMatchEQ {
  data: Data;
}

// Complete collection folder and items
interface CollectionFolder {
  name: string;
  items?: (CollectionFolder | KeywordCollection | SmartCollection)[];
}

// Structure for Smart Collection
interface SmartCollection {
  name: string;
  match: 'any' | 'all';
  matches?: Match[];
}

// Structuring match attributes properly
interface MatchText {
  enabled?: '0' | '1';
  rule: 'includes' | 'doesNotInclude' | 'is' | 'isNot';
  value: string;
}

interface MatchRatings {
  enabled?: '0' | '1';
  value: 'favorites' | 'rejected';
}

interface MatchMedia {
  enabled?: '0' | '1';
  rule: 'is' | 'isNot';
  type: 'videoWithAudio' | 'videoOnly' | 'audioOnly' | 'stills';
}

interface MatchClip {
  enabled?: '0' | '1';
  rule: 'is' | 'isNot';
  type:
    | 'audition'
    | 'synchronized'
    | 'compound'
    | 'multicam'
    | 'layeredGraphic'
    | 'project';
}

interface MatchStabilization {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  types?: StabilizationType[];
}

interface MatchKeywords {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  keywordNames?: KeywordName[];
}

interface MatchShot {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  shotTypes?: ShotType[];
}

interface MatchProperty {
  enabled?: '0' | '1';
  key:
    | 'reel'
    | 'scene'
    | 'take'
    | 'audioOutputChannels'
    | 'frameSize'
    | 'videoFrameRate'
    | 'audioSampleRate'
    | 'cameraName'
    | 'cameraAngle';
  rule: 'includes' | 'doesNotInclude' | 'is' | 'isNot';
  value: string;
}

interface MatchTime {
  enabled?: '0' | '1';
  type: 'contentCreated' | 'dateImported';
  rule: 'is' | 'isBefore' | 'isAfter';
  value: string;
}

interface MatchTimeRange {
  enabled?: '0' | '1';
  type: 'contentCreated' | 'dateImported';
  rule: 'isInLast' | 'isNotInLast';
  value: string;
  units?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

interface MatchRoles {
  enabled?: '0' | '1';
  rule:
    | 'includesAny'
    | 'includesAll'
    | 'doesNotIncludeAny'
    | 'doesNotIncludeAll';
  roles?: Role[];
}

interface Role {
  name: string;
}

// End types
interface ArrayType {
  values: string[];
}

interface StringType {
  value: string;
}
