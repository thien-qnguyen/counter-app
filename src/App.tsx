import { Capacitor } from '@capacitor/core';
import { THEMES } from './themes';
import { useCounters } from './useCounters';
import { ListScreen } from './components/ListScreen';
import { CreateScreen } from './components/CreateScreen';
import { DetailScreen } from './components/DetailScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { VariantPicker } from './components/VariantPicker';
import type { CounterType, Variant } from './types';
import { applyIncrement, applyDecrement, applyReset, deleteHistoryEntry } from './counterLogic';

export default function App() {
  const { state, setState } = useCounters();
  const theme = THEMES[state.variant];
  const selected = state.counters.find(c => c.id === state.selectedId) ?? state.counters[0];

  function handleCreate(name: string, type: CounterType, max: number) {
    const id = state.nextId;
    setState(s => ({
      counters: [...s.counters, { id, name, type, max, value: 0, history: {} }],
      nextId: id + 1,
      screen: 'detail',
      selectedId: id,
    }));
  }

  function handleDeleteCounter() {
    setState(s => {
      const counters = s.counters.filter(c => c.id !== s.selectedId);
      return {
        counters,
        selectedId: counters[0]?.id ?? -1,
        screen: 'list',
        showDeleteConfirm: false,
      };
    });
  }

  const screens = (
    <>
      {state.screen === 'list' && (
        <ListScreen
          counters={state.counters}
          theme={theme}
          onOpen={id => setState({ screen: 'detail', selectedId: id })}
          onCreate={() => setState({ screen: 'create' })}
        />
      )}
      {state.screen === 'create' && (
        <CreateScreen
          theme={theme}
          onBack={() => setState({ screen: 'list' })}
          onSubmit={handleCreate}
        />
      )}
      {state.screen === 'detail' && selected && (
        <DetailScreen
          counter={selected}
          theme={theme}
          showResetConfirm={state.showResetConfirm}
          showDeleteConfirm={state.showDeleteConfirm}
          onBack={() => setState({ screen: 'list', showResetConfirm: false, showDeleteConfirm: false })}
          onIncrement={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? applyIncrement(c) : c) }))}
          onDecrement={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? applyDecrement(c) : c) }))}
          onRequestReset={() => setState({ showResetConfirm: true })}
          onCancelReset={() => setState({ showResetConfirm: false })}
          onConfirmReset={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? applyReset(c) : c), showResetConfirm: false }))}
          onOpenHistory={() => setState({ screen: 'history' })}
          onRequestDelete={() => setState({ showDeleteConfirm: true })}
          onCancelDelete={() => setState({ showDeleteConfirm: false })}
          onConfirmDelete={handleDeleteCounter}
        />
      )}
      {state.screen === 'history' && selected && (
        <HistoryScreen
          counter={selected}
          theme={theme}
          onBack={() => setState({ screen: 'detail' })}
          onDeleteEntry={key => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? deleteHistoryEntry(c, key) : c) }))}
        />
      )}
    </>
  );

  if (Capacitor.isNativePlatform()) {
    return (
      <div style={{ width: '100vw', height: '100dvh', background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <VariantPicker current={state.variant} onChange={(v: Variant) => setState({ variant: v })} theme={theme} />
        <div style={{ flex: 1, minHeight: 0 }}>{screens}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <VariantPicker current={state.variant} onChange={(v: Variant) => setState({ variant: v })} theme={theme} />
        <div style={{ width: 360, height: 740, borderRadius: 36, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: `2px solid ${theme.bezel}` }}>
          {screens}
        </div>
      </div>
    </div>
  );
}
