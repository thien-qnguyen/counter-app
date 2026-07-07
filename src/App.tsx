import { THEMES } from './themes';
import { useCounters } from './useCounters';
import { ListScreen } from './components/ListScreen';
import { CreateScreen } from './components/CreateScreen';
import { DetailScreen } from './components/DetailScreen';
import { VariantPicker } from './components/VariantPicker';
import type { CounterType, Variant } from './types';

export default function App() {
  const { state, setState } = useCounters();
  const theme = THEMES[state.variant];
  const selected = state.counters.find(c => c.id === state.selectedId) ?? state.counters[0];

  function handleCreate(name: string, type: CounterType, max: number) {
    const id = state.nextId;
    setState(s => ({
      counters: [...s.counters, { id, name, type, max, value: 0 }],
      nextId: id + 1,
      screen: 'detail',
      selectedId: id,
    }));
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <VariantPicker current={state.variant} onChange={(v: Variant) => setState({ variant: v })} theme={theme} />
        <div style={{ width: 360, height: 740, borderRadius: 36, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: `2px solid ${theme.bezel}` }}>
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
              onBack={() => setState({ screen: 'list', showResetConfirm: false })}
              onIncrement={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? { ...c, value: Math.min(c.max, c.value + 1) } : c) }))}
              onDecrement={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? { ...c, value: Math.max(0, c.value - 1) } : c) }))}
              onRequestReset={() => setState({ showResetConfirm: true })}
              onCancelReset={() => setState({ showResetConfirm: false })}
              onConfirmReset={() => setState(s => ({ counters: s.counters.map(c => c.id === s.selectedId ? { ...c, value: 0 } : c), showResetConfirm: false }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
