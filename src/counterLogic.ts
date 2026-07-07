import type { Counter, CounterType } from './types';

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

export function computeTotal(_type: CounterType, history: Record<string, number>): number {
  return Object.values(history).reduce((sum, v) => sum + v, 0);
}

export function ensureHistory(counter: Counter): Counter {
  if (counter.type === 'custom') return counter;
  if (counter.history) return counter;
  const history: Record<string, number> = counter.value > 0 ? { [LEGACY_DATE]: counter.value } : {};
  return { ...counter, history, value: computeTotal(counter.type, history) };
}

export function applyIncrement(counter: Counter): Counter {
  if (counter.type === 'custom') {
    return { ...counter, value: Math.min(counter.max, counter.value + 1) };
  }
  const key = todayKey();
  const history = { ...(counter.history ?? {}) };
  if (counter.type === 'daily') {
    if (history[key]) return counter;
    history[key] = 1;
  } else {
    history[key] = (history[key] ?? 0) + 1;
  }
  const value = Math.min(counter.max, computeTotal(counter.type, history));
  return { ...counter, history, value };
}

export function applyDecrement(counter: Counter): Counter {
  if (counter.type === 'custom') {
    return { ...counter, value: Math.max(0, counter.value - 1) };
  }
  const key = todayKey();
  const history = { ...(counter.history ?? {}) };
  if (counter.type === 'daily') {
    if (!history[key]) return counter;
    delete history[key];
  } else {
    const cur = history[key] ?? 0;
    if (cur <= 0) return counter;
    if (cur - 1 <= 0) delete history[key];
    else history[key] = cur - 1;
  }
  const value = Math.max(0, computeTotal(counter.type, history));
  return { ...counter, history, value };
}

export function applyReset(counter: Counter): Counter {
  if (counter.type === 'custom') return { ...counter, value: 0 };
  return { ...counter, history: {}, value: 0 };
}

export function deleteHistoryEntry(counter: Counter, key: string): Counter {
  if (counter.type === 'custom' || !counter.history) return counter;
  const history = { ...counter.history };
  delete history[key];
  const value = computeTotal(counter.type, history);
  return { ...counter, history, value };
}
