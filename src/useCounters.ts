import { useState, useEffect } from 'react';
import type { Counter, CounterType, Screen, Variant } from './types';
import { ensureHistory } from './counterLogic';

interface State {
  screen: Screen;
  counters: Counter[];
  nextId: number;
  selectedId: number;
  showResetConfirm: boolean;
  showDeleteConfirm: boolean;
  formType: CounterType | null;
  formName: string;
  formMax: string;
  variant: Variant;
}

const STORAGE_KEY = 'counter-app-state';

function loadState(): Partial<State> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const DEFAULT_COUNTERS: Counter[] = [
  { id: 1, name: 'Cà phê', type: 'custom', max: 12, value: 4 },
  { id: 2, name: 'Tập gym', type: 'daily', max: 365, value: 128 },
  { id: 3, name: 'Hút thuốc', type: 'frequency', max: 100, value: 7 },
];

export function useCounters() {
  const saved = loadState();
  const [state, setStateRaw] = useState<State>({
    screen: 'list',
    counters: (saved.counters ?? DEFAULT_COUNTERS).map(ensureHistory),
    nextId: saved.nextId ?? 4,
    selectedId: saved.selectedId ?? 2,
    showResetConfirm: false,
    showDeleteConfirm: false,
    formType: null,
    formName: '',
    formMax: '',
    variant: saved.variant ?? 'a',
  });

  function setState(updater: Partial<State> | ((s: State) => Partial<State>)) {
    setStateRaw(prev => {
      const patch = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...patch };
    });
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      counters: state.counters,
      nextId: state.nextId,
      selectedId: state.selectedId,
      variant: state.variant,
    }));
  }, [state.counters, state.nextId, state.selectedId, state.variant]);

  return { state, setState };
}
