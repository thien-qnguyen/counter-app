import type { Theme, Variant } from './types';

export const THEMES: Record<Variant, Theme> = {
  a: {
    accent: '#ffb020', onAccent: '#1a1200', accentShadow: 'rgba(255,176,32,0.35)',
    bg: '#15181c', face: '#1b2025', faceHover: '#222833', bezel: '#2a3138',
    ringBorder: 'rgba(255,255,255,0.08)', tickMinor: 'rgba(255,255,255,0.22)',
    tickMajor: '#eef1f3', labelColor: 'rgba(238,241,243,0.55)', needle: '#ffb020',
    gradFrom: '#ffe066', gradTo: '#ff8a00',
    sweepStart: -135, sweepSpan: 270, redline: false, rivets: false, variant: 'a',
  },
  b: {
    accent: '#2dd4bf', onAccent: '#04211d', accentShadow: 'rgba(45,212,191,0.35)',
    bg: '#0c1210', face: '#101917', faceHover: '#16211e', bezel: '#1c2b27',
    ringBorder: 'rgba(255,255,255,0.08)', tickMinor: 'rgba(255,255,255,0.2)',
    tickMajor: '#dff7f2', labelColor: 'rgba(223,247,242,0.5)', needle: '#2dd4bf',
    gradFrom: '#2dd4bf', gradTo: '#3b82f6',
    sweepStart: -90, sweepSpan: 180, redline: false, rivets: true, variant: 'b',
  },
  c: {
    accent: '#ff5a3c', onAccent: '#210900', accentShadow: 'rgba(255,90,60,0.35)',
    bg: '#171012', face: '#1d1517', faceHover: '#271b1e', bezel: '#33201f',
    ringBorder: 'rgba(255,255,255,0.08)', tickMinor: 'rgba(255,255,255,0.22)',
    tickMajor: '#f3e9e8', labelColor: 'rgba(243,233,232,0.5)', needle: '#ff8a5c',
    gradFrom: '#ffb347', gradTo: '#ff5a3c',
    sweepStart: -120, sweepSpan: 240, redline: true, rivets: false, variant: 'c',
  },
};

export const TYPE_LABELS: Record<string, string> = {
  frequency: 'Tần suất / ngày',
  daily: 'Điểm danh / ngày',
  custom: 'Tùy chỉnh',
};

export const UNIT_LABELS: Record<string, string> = {
  frequency: 'lần',
  daily: 'ngày',
  custom: 'lần',
};

export const TYPE_MAX: Record<string, number> = {
  frequency: 100,
  daily: 365,
  custom: 0,
};
