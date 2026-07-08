import { useState } from 'react';
import type { CounterType, Theme, TrackingMode } from '../types';
import { TYPE_MAX } from '../themes';

interface Props {
  theme: Theme;
  onBack: () => void;
  onSubmit: (name: string, type: CounterType, max: number, initialValue: number, customMode: TrackingMode) => void;
}

const CUSTOM_MODE_MAX: Record<TrackingMode, number> = {
  frequency: TYPE_MAX.frequency,
  daily: TYPE_MAX.daily,
  none: TYPE_MAX.custom,
};

const CUSTOM_MODE_LABELS: Record<TrackingMode, { title: string; desc: string }> = {
  frequency: { title: 'Tần suất theo ngày', desc: 'Đếm số lần mỗi ngày, lưu lịch sử theo ngày' },
  daily: { title: 'Điểm danh theo ngày', desc: 'Điểm danh mỗi ngày, lưu lịch sử theo ngày' },
  none: { title: 'Tổng tự do', desc: 'Không theo ngày, không lưu lịch sử' },
};

export function CreateScreen({ theme: t, onBack, onSubmit }: Props) {
  const [formType, setFormType] = useState<CounterType | null>(null);
  const [customMode, setCustomMode] = useState<TrackingMode>('none');
  const [name, setName] = useState('');
  const [maxStr, setMaxStr] = useState('');
  const [initialStr, setInitialStr] = useState('0');

  const max = parseInt(maxStr, 10);
  const initial = parseInt(initialStr, 10);
  const nameOk = name.trim().length > 0;
  const maxOk = max >= 2 && max <= 9999;
  const initialOk = initialStr.trim() === '' || (!isNaN(initial) && initial >= 0);
  const canSubmit = !!formType && nameOk && maxOk && initialOk;

  function handleSelectType(type: CounterType) {
    setFormType(type);
    setMaxStr(String(type === 'custom' ? CUSTOM_MODE_MAX[customMode] : TYPE_MAX[type]));
  }

  function handleSelectCustomMode(mode: TrackingMode) {
    setCustomMode(mode);
    setMaxStr(String(CUSTOM_MODE_MAX[mode]));
  }

  function handleSubmit() {
    if (!canSubmit || !formType) return;
    const initialValue = Math.max(0, Math.min(max, isNaN(initial) ? 0 : initial));
    onSubmit(name.trim(), formType, max, initialValue, formType === 'custom' ? customMode : formType);
  }

  function borderFor(type: CounterType) {
    return formType === type ? `2px solid ${t.accent}` : `2px solid ${t.ringBorder}`;
  }

  function customModeBorderFor(mode: TrackingMode) {
    return customMode === mode ? `2px solid ${t.accent}` : `2px solid ${t.ringBorder}`;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', background: t.face, border: `1px solid ${t.ringBorder}`,
    borderRadius: 10, padding: '12px 14px', color: '#eef1f3', fontSize: 15,
    fontFamily: "'Oswald',sans-serif", outline: 'none',
  };

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, display: 'flex', flexDirection: 'column', fontFamily: "'Oswald',system-ui,sans-serif", color: '#eef1f3', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: t.face, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="#eef1f3" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Tạo bộ đếm mới</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', margin: '10px 0' }}>Chọn loại</div>

        {(['frequency', 'daily', 'custom'] as CounterType[]).map(type => (
          <div key={type} onClick={() => handleSelectType(type)}
            style={{ border: borderFor(type), background: t.face, borderRadius: 14, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ fontSize: 15.5, fontWeight: 600 }}>
              {type === 'frequency' ? 'Tần suất theo ngày' : type === 'daily' ? 'Điểm danh theo ngày' : 'Tùy chỉnh'}
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(238,241,243,0.5)', marginTop: 3 }}>
              {type === 'frequency' ? 'Đếm số lần mỗi ngày, lưu lịch sử theo ngày' : type === 'daily' ? 'Điểm danh mỗi ngày, lưu lịch sử theo ngày' : 'Tự đặt tên, tự chọn kiểu theo dõi bên dưới'}
            </div>
          </div>
        ))}

        {formType === 'custom' && (
          <div style={{ marginTop: 4, marginBottom: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', margin: '10px 0' }}>Kiểu theo dõi</div>
            {(['frequency', 'daily', 'none'] as TrackingMode[]).map(mode => (
              <div key={mode} onClick={() => handleSelectCustomMode(mode)}
                style={{ border: customModeBorderFor(mode), background: t.face, borderRadius: 14, padding: '12px 16px', marginBottom: 8, cursor: 'pointer' }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{CUSTOM_MODE_LABELS[mode].title}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,241,243,0.5)', marginTop: 2 }}>{CUSTOM_MODE_LABELS[mode].desc}</div>
              </div>
            ))}
          </div>
        )}

        {formType && (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', marginBottom: 8 }}>Tên bộ đếm</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Uống nước" style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', marginBottom: 8 }}>Giới hạn tối đa</div>
              <input value={maxStr} onChange={e => setMaxStr(e.target.value)} type="number" min={2} max={9999} placeholder="VD: 730"
                style={{ ...inputStyle, fontFamily: "'JetBrains Mono',monospace" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', marginBottom: 8 }}>Giá trị khởi tạo</div>
              <input value={initialStr} onChange={e => setInitialStr(e.target.value)} type="number" min={0} max={max || undefined} placeholder="0"
                style={{ ...inputStyle, fontFamily: "'JetBrains Mono',monospace" }} />
              <div style={{ fontSize: 12, color: 'rgba(238,241,243,0.45)', marginTop: 6 }}>Đã có tiến độ từ trước? Nhập số đã tích lũy để bắt đầu từ đó thay vì 0.</div>
            </div>
            <button onClick={handleSubmit} disabled={!canSubmit}
              style={{ marginTop: 6, background: t.accent, color: t.onAccent, opacity: canSubmit ? 1 : 0.45, border: 'none', borderRadius: 12, padding: 14, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
              Tạo bộ đếm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
