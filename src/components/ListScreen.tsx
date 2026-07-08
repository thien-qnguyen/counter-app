import type { Counter, Theme } from '../types';
import { buildGauge } from '../gauge';
import { typeLabel } from '../counterLogic';

interface Props {
  counters: Counter[];
  theme: Theme;
  onOpen: (id: number) => void;
  onCreate: () => void;
}

function MiniGauge({ counter, t }: { counter: Counter; t: Theme }) {
  const g = buildGauge(counter.max, counter.value, t);
  return (
    <svg viewBox="0 0 260 260" style={{ width: 92, height: 92, overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <radialGradient id={`oledBgMini${counter.id}`} cx="50%" cy="45%" r="68%">
          <stop offset="0%" stopColor="#1c1f22" />
          <stop offset="55%" stopColor="#0c0d0f" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
      <circle cx="130" cy="130" r="118" fill={`url(#oledBgMini${counter.id})`} />
      {g.ticks.filter(tk => tk.o > 0.9).map(tk => (
        <line key={tk.key} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2} stroke={tk.color} strokeWidth={2.4} opacity={tk.o} />
      ))}
      <line x1="130" y1="130" x2={g.needleTipX} y2={g.needleTipY} stroke={t.accent} strokeWidth="4" strokeLinecap="round" />
      <circle cx="130" cy="130" r="6" fill={t.accent} />
    </svg>
  );
}

export function ListScreen({ counters, theme: t, onOpen, onCreate }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', fontFamily: "'Oswald',system-ui,sans-serif", color: '#eef1f3', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ padding: '22px 20px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: t.accent, fontWeight: 600, opacity: 0.85 }}>Bảng điều khiển</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>Bộ đếm</div>
        </div>
        <button
          onClick={onCreate}
          style={{ background: t.accent, color: t.onAccent, border: 'none', borderRadius: 100, padding: '11px 18px', fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 0.3, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: `0 4px 14px ${t.accentShadow}` }}
        >
          <span style={{ fontSize: 18, lineHeight: 0, marginBottom: 1 }}>+</span>Mới
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 16px 24px' }}>
        {counters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(238,241,243,0.4)' }}>
            <div style={{ fontSize: 15 }}>Chưa có bộ đếm nào</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Bấm "+ Mới" để tạo bộ đếm đầu tiên</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {counters.map(c => (
              <div
                key={c.id}
                onClick={() => onOpen(c.id)}
                style={{ background: t.face, border: `1px solid ${t.ringBorder}`, borderRadius: 16, padding: '16px 10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <MiniGauge counter={c} t={t} />
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{c.name}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(238,241,243,0.45)', marginTop: 1, letterSpacing: 0.3, textTransform: 'uppercase' }}>{typeLabel(c)}</div>
                <div style={{ marginTop: 8, width: '100%', background: '#0c0d0f', border: `1px solid ${t.ringBorder}`, borderRadius: 8, padding: '5px 0', textAlign: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: t.accent }}>{c.value}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(238,241,243,0.4)' }}> / {c.max}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
