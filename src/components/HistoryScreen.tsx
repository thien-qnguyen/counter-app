import type { Counter, Theme } from '../types';
import { formatDateLabel, unitLabel } from '../counterLogic';

interface Props {
  counter: Counter;
  theme: Theme;
  onBack: () => void;
  onDeleteEntry: (key: string) => void;
}

export function HistoryScreen({ counter, theme: t, onBack, onDeleteEntry }: Props) {
  const entries = Object.entries(counter.history ?? {}).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', fontFamily: "'Oswald',system-ui,sans-serif", color: '#eef1f3', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: t.face, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="#eef1f3" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{counter.name}</div>
          <div style={{ fontSize: 11.5, color: t.accent, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Lịch sử</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(238,241,243,0.4)' }}>
            <div style={{ fontSize: 15 }}>Chưa có lịch sử</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Bấm "+" ở màn chi tiết để bắt đầu ghi nhận hôm nay</div>
          </div>
        ) : entries.map(([key, count]) => (
          <div key={key} style={{ background: t.face, border: `1px solid ${t.ringBorder}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{formatDateLabel(key)}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(238,241,243,0.5)', marginTop: 2 }}>{count} {unitLabel(counter)}</div>
            </div>
            <button
              onClick={() => onDeleteEntry(key)}
              style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: `1px solid ${t.ringBorder}`, color: 'rgba(238,241,243,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
