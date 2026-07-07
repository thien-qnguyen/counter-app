import type { Theme } from './types';

interface Point { x: number; y: number }

function polar(cx: number, cy: number, r: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export interface Tick {
  key: string; x1: number; y1: number; x2: number; y2: number;
  color: string; w: number; o: number;
}

export interface Label { key: string; x: number; y: number; text: string }

export interface GaugeData {
  ticks: Tick[];
  labels: Label[];
  trackDash: string;
  progressDash: string;
  ringRotate: string;
  warnDash: string;
  warnRotate: string;
  needleTipX: number; needleTipY: number;
  needleTailX: number; needleTailY: number;
}

export function buildGauge(max: number, value: number, t: Theme): GaugeData {
  const cx = 130, cy = 130, rOuter = 108;
  const step = max <= 30 ? 1 : max <= 100 ? 2 : 5;
  const majorEvery = max <= 30 ? 5 : max <= 100 ? 10 : 50;
  const ticks: Tick[] = [];
  const labels: Label[] = [];

  for (let v = 0; v <= max; v += step) {
    const isMajor = v % majorEvery === 0 || v === max;
    const angle = t.sweepStart + (v / max) * t.sweepSpan;
    const rInner = isMajor ? rOuter - 14 : rOuter - 7;
    const p1 = polar(cx, cy, rOuter, angle);
    const p2 = polar(cx, cy, rInner, angle);
    ticks.push({
      key: `t${v}`, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      color: isMajor ? '#f2f6fa' : 'rgba(230,238,244,0.6)',
      w: isMajor ? 2 : 1,
      o: isMajor ? 0.95 : 0.55,
    });
    if (isMajor) {
      const lp = polar(cx, cy, rOuter - 27, angle);
      labels.push({ key: `l${v}`, x: lp.x, y: lp.y, text: String(v) });
    }
  }

  const clamped = Math.max(0, Math.min(max, value));
  const pct = clamped / max;
  const needleDeg = t.sweepStart + pct * t.sweepSpan;

  const ringR = 94;
  const circumference = 2 * Math.PI * ringR;
  const sweepLen = circumference * (t.sweepSpan / 360);
  const progressLen = circumference * ((pct * t.sweepSpan) / 360);
  const trackDash = `${sweepLen} ${circumference}`;
  const progressDash = `${progressLen} ${circumference}`;
  const ringRotate = `rotate(${t.sweepStart - 90} 130 130)`;

  const rad = (needleDeg * Math.PI) / 180;
  const dir = { x: Math.sin(rad), y: -Math.cos(rad) };
  const needleTipX = cx + dir.x * 88, needleTipY = cy + dir.y * 88;
  const needleTailX = cx + dir.x * -22, needleTailY = cy + dir.y * -22;

  const warnStartPct = 0.85;
  const warnLen = circumference * (((1 - warnStartPct) * t.sweepSpan) / 360);
  const warnDash = `${warnLen} ${circumference}`;
  const warnRotate = `rotate(${t.sweepStart - 90 + warnStartPct * t.sweepSpan} 130 130)`;

  return { ticks, labels, trackDash, progressDash, ringRotate, warnDash, warnRotate, needleTipX, needleTipY, needleTailX, needleTailY };
}
