export type CounterType = 'frequency' | 'daily' | 'custom';
export type Variant = 'a' | 'b' | 'c';
export type Screen = 'list' | 'create' | 'detail';

export interface Counter {
  id: number;
  name: string;
  type: CounterType;
  max: number;
  value: number;
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
