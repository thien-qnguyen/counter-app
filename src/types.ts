export type CounterType = 'frequency' | 'daily' | 'custom';
export type TrackingMode = 'frequency' | 'daily' | 'none';
export type Variant = 'a' | 'b' | 'c';
export type Screen = 'list' | 'create' | 'detail' | 'history';

export interface Counter {
  id: number;
  name: string;
  type: CounterType;
  /** Only meaningful when type === 'custom': which history behavior it follows. */
  customMode?: TrackingMode;
  max: number;
  value: number;
  history?: Record<string, number>;
}

export interface Theme {
  accent: string;
  onAccent: string;
  accentShadow: string;
  bg: string;
  face: string;
  faceHover: string;
  bezel: string;
  ringBorder: string;
  tickMinor: string;
  tickMajor: string;
  labelColor: string;
  needle: string;
  gradFrom: string;
  gradTo: string;
  sweepStart: number;
  sweepSpan: number;
  redline: boolean;
  rivets: boolean;
  variant: Variant;
}
