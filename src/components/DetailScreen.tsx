import type { Counter, Theme } from '../types';
import { TYPE_LABELS, UNIT_LABELS } from '../themes';
import { buildGauge } from '../gauge';
import { todayKey } from '../counterLogic';

interface Props {
  counter: Counter;
  theme: Theme;
  showResetConfirm: boolean;
  showDeleteConfirm: boolean;
  onBack: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRequestReset: () => void;
  onConfirmReset: () => void;
  onCancelReset: () => void;
  onOpenHistory: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function DetailScreen({ counter, theme: t, showResetConfirm, showDeleteConfirm, onBack, onIncrement, onDecrement, onRequestReset, onConfirmReset, onCancelReset, onOpenHistory, onRequestDelete, onConfirmDelete, onCancelDelete }: Props) {
  const g = buildGauge(counter.max, counter.value, t);
  const hasHistory = counter.type !== 'custom';
  const todayCount = hasHistory ? (counter.history?.[todayKey()] ?? 0) : null;

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', fontFamily: "'Oswald',system-ui,sans-serif", color: '#eef1f3', overflow: 'hidden', position: 'relative', boxSizing: 'border-box' }}>
      <div style={{ padding: '18px 16px 6px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: t.face, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="#eef1f3" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 17.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{counter.name}</div>
          <div style={{ fontSize: 11.5, color: t.accent, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{TYPE_LABELS[counter.type]}</div>
        </div>
        {hasHistory && (
          <div onClick={onOpenHistory} style={{ width: 36, height: 36, borderRadius: 10, background: t.face, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M12 8v4l3 2M21 12a9 9 0 1 1-9-9" stroke="#eef1f3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
        <div onClick={onRequestDelete} style={{ width: 36, height: 36, borderRadius: 10, background: t.face, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="#eef1f3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 16px', minHeight: 0 }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 280, aspectRatio: '1/1' }}>
          <svg viewBox="0 0 260 260" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <radialGradient id="oledBg" cx="50%" cy="45%" r="68%">
                <stop offset="0%" stopColor="#1c1f22" />
                <stop offset="55%" stopColor="#0c0d0f" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <filter id="glowSoft" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="1.3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <circle cx="130" cy="130" r="118" fill="url(#oledBg)" />
            <circle cx="130" cy="130" r="105" fill="none" stroke="#ff3b30" strokeWidth="2.2" strokeLinecap="round"
              strokeDasharray={g.warnDash} transform={g.warnRotate} opacity="0.9" filter="url(#glowStrong)" />
            <circle cx="130" cy="130" r="94" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"
              strokeDasharray={g.trackDash} transform={g.ringRotate} />
            <circle cx="130" cy="130" r="94" fill="none" stroke={t.accent} strokeWidth="2.2" strokeLinecap="round"
              strokeDasharray={g.progressDash} transform={g.ringRotate} filter="url(#glowStrong)" style={{ transition: 'stroke-dasharray .35s ease' }} />

            {g.ticks.map(tk => (
              <line key={tk.key} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
                stroke={tk.color} strokeWidth={tk.w} opacity={tk.o} filter="url(#glowSoft)" />
            ))}
            {g.labels.map(lb => (
              <text key={lb.key} x={lb.x} y={lb.y} textAnchor="middle" dominantBaseline="middle"
                fontSize="11.5" fontFamily="'Titillium Web',sans-serif" fontWeight="400" fill="rgba(235,240,245,0.65)">{lb.text}</text>
            ))}

            <line x1="130" y1="130" x2={g.needleTipX} y2={g.needleTipY}
              stroke="#eef3f8" strokeWidth="2" strokeLinecap="round" filter="url(#glowSoft)"
              style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }} />
            <line x1="130" y1="130" x2={g.needleTailX} y2={g.needleTailY}
              stroke="#eef3f8" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"
              style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }} />
            <circle cx={g.needleTipX} cy={g.needleTipY} r="3" fill={t.accent} filter="url(#glowStrong)"
              style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }} />

            <circle cx="130" cy="130" r="9" fill="none" stroke={t.accent} strokeWidth="1" opacity="0.55" filter="url(#glowSoft)" />
            <circle cx="130" cy="130" r="3" fill="#eef3f8" filter="url(#glowStrong)" />
          </svg>
        </div>

        <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 58, lineHeight: 1, fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, color: '#f3f6f9', letterSpacing: 0.5 }}>{counter.value}</div>
          <div style={{ marginTop: 6, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(235,240,245,0.4)', fontWeight: 400 }}>/ {counter.max} {UNIT_LABELS[counter.type]}</div>
          {hasHistory && (
            <div style={{ marginTop: 10, fontSize: 12, letterSpacing: 0.5, color: t.accent, fontWeight: 500 }}>
              {counter.type === 'daily'
                ? (todayCount ? 'Đã điểm danh hôm nay' : 'Chưa điểm danh hôm nay')
                : `Hôm nay: ${todayCount} ${UNIT_LABELS[counter.type]}`}
            </div>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '8px 24px 26px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <button onClick={onDecrement}
          style={{ width: 56, height: 56, borderRadius: 100, background: `linear-gradient(180deg,${t.faceHover},${t.face})`, border: `1px solid ${t.ringBorder}`, color: '#eef1f3', fontSize: 26, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 6px rgba(0,0,0,0.4)' }}>
          −
        </button>
        <button onClick={onRequestReset}
          style={{ width: 44, height: 44, borderRadius: 100, background: `linear-gradient(180deg,${t.faceHover},${t.face})`, border: `1.5px solid rgba(238,241,243,0.18)`, color: 'rgba(238,241,243,0.65)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.35)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={onIncrement}
          style={{ width: 56, height: 56, borderRadius: 100, background: `linear-gradient(180deg,${t.accent},${t.accent})`, border: 'none', color: t.onAccent, fontSize: 26, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${t.accentShadow}` }}>
          +
        </button>
      </div>

      {showResetConfirm && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 10 }}>
          <div style={{ background: t.face, border: `1px solid ${t.ringBorder}`, borderRadius: 16, padding: 22, width: '100%', maxWidth: 280, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 16.5, fontWeight: 600, marginBottom: 6 }}>Đặt lại về 0?</div>
            <div style={{ fontSize: 13, color: 'rgba(238,241,243,0.55)', lineHeight: 1.5, marginBottom: 18 }}>
              Giá trị hiện tại của "{counter.name}" sẽ bị xóa và không thể hoàn tác.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onCancelReset}
                style={{ flex: 1, background: 'transparent', border: `1px solid ${t.ringBorder}`, color: '#eef1f3', borderRadius: 10, padding: 11, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Hủy
              </button>
              <button onClick={onConfirmReset}
                style={{ flex: 1, background: '#ff4d4d', border: 'none', color: '#fff', borderRadius: 10, padding: 11, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 10 }}>
          <div style={{ background: t.face, border: `1px solid ${t.ringBorder}`, borderRadius: 16, padding: 22, width: '100%', maxWidth: 280, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 16.5, fontWeight: 600, marginBottom: 6 }}>Xoá bộ đếm?</div>
            <div style={{ fontSize: 13, color: 'rgba(238,241,243,0.55)', lineHeight: 1.5, marginBottom: 18 }}>
              "{counter.name}" và toàn bộ lịch sử sẽ bị xoá vĩnh viễn.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onCancelDelete}
                style={{ flex: 1, background: 'transparent', border: `1px solid ${t.ringBorder}`, color: '#eef1f3', borderRadius: 10, padding: 11, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Hủy
              </button>
              <button onClick={onConfirmDelete}
                style={{ flex: 1, background: '#ff4d4d', border: 'none', color: '#fff', borderRadius: 10, padding: 11, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
