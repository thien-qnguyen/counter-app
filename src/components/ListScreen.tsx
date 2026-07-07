import type { Counter, Theme } from '../types';
import { TYPE_LABELS } from '../themes';

interface Props {
  counters: Counter[];
  theme: Theme;
  onOpen: (id: number) => void;
  onCreate: () => void;
}

export function ListScreen({ counters, theme: t, onOpen, onCreate }: Props) {
  const circumference = 2 * Math.PI * 19;

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

      <div style={{ flex: 1, overflow: 'auto', padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {counters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(238,241,243,0.4)' }}>
            <div style={{ fontSize: 15 }}>Chưa có bộ đếm nào</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Bấm "+ Mới" để tạo bộ đếm đầu tiên</div>
          </div>
        ) : counters.map(c => {
          const pct = Math.max(0, Math.min(1, c.value / c.max));
          const dashOffset = circumference * (1 - pct);
          return (
            <div
              key={c.id}
              onClick={() => onOpen(c.id)}
              style={{ background: t.face, border: `1px solid ${t.ringBorder}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="24" cy="24" r="19" fill="none" stroke={t.accent} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${circumference}`} strokeDashoffset={dashOffset} transform="rotate(-90 24 24)" />
                <text x="24" y="28" textAnchor="middle" fontSize="12" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fill="#eef1f3">{c.value}</text>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(238,241,243,0.5)', marginTop: 2, letterSpacing: 0.2 }}>{TYPE_LABELS[c.type]} · {c.value} / {c.max}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path d="M9 6l6 6-6 6" stroke="#eef1f3" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
