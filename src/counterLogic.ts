import type { Counter, TrackingMode } from './types';
import { TYPE_LABELS, UNIT_LABELS } from './themes';

export const LEGACY_DATE = '2000-01-01';

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateLabel(key: string): string {
  if (key === LEGACY_DATE) return 'Trước đó';
  const [y, m, d] = key.split('-').map(Number);
  return `${d}/${m}/${y}`;
}

export function computeTotal(history: Record<string, number>): number {
  return Object.values(history).reduce((sum, v) => sum + v, 0);
}

export function trackingModeOf(counter: Counter): TrackingMode {
  if (counter.type === 'frequency') return 'frequency';
  if (counter.type === 'daily') return 'daily';
  return counter.customMode ?? 'none';
}

export function typeLabel(counter: Counter): string {
  if (counter.type !== 'custom') return TYPE_LABELS[counter.type];
  const mode = counter.customMode ?? 'none';
  return mode === 'none' ? TYPE_LABELS.custom : TYPE_LABELS[mode];
}

export function unitLabel(counter: Counter): string {
  return trackingModeOf(counter) === 'daily' ? UNIT_LABELS.daily : UNIT_LABELS.frequency;
}

export function ensureHistory(counter: Counter): Counter {
  if (trackingModeOf(counter) === 'none') return counter;
  if (counter.history) return counter;
  const history: Record<string, number> = counter.value > 0 ? { [LEGACY_DATE]: counter.value } : {};
  return { ...counter, history, value: computeTotal(history) };
}

export function applyIncrement(counter: Counter): Counter {
  const mode = trackingModeOf(counter);
  if (mode === 'none') {
    return { ...counter, value: Math.min(counter.max, counter.value + 1) };
  }
  const key = todayKey();
  const history = { ...(counter.history ?? {}) };
  if (mode === 'daily') {
    if (history[key]) return counter;
    history[key] = 1;
  } else {
    history[key] = (history[key] ?? 0) + 1;
  }
  const value = Math.min(counter.max, computeTotal(history));
  return { ...counter, history, value };
}

export function applyDecrement(counter: Counter): Counter {
  const mode = trackingModeOf(counter);
  if (mode === 'none') {
    return { ...counter, value: Math.max(0, counter.value - 1) };
  }
  const key = todayKey();
  const history = { ...(counter.history ?? {}) };
  if (mode === 'daily') {
    if (!history[key]) return counter;
    delete history[key];
  } else {
    const cur = history[key] ?? 0;
    if (cur <= 0) return counter;
    if (cur - 1 <= 0) delete history[key];
    else history[key] = cur - 1;
  }
  const value = Math.max(0, computeTotal(history));
  return { ...counter, history, value };
}

export function applyReset(counter: Counter): Counter {
  if (trackingModeOf(counter) === 'none') return { ...counter, value: 0 };
  return { ...counter, history: {}, value: 0 };
}

export function deleteHistoryEntry(counter: Counter, key: string): Counter {
  if (trackingModeOf(counter) === 'none' || !counter.history) return counter;
  const history = { ...counter.history };
  delete history[key];
  const value = computeTotal(history);
  return { ...counter, history, value };
}
