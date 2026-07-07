import { useState } from 'react';
import type { CounterType, Theme } from '../types';
import { TYPE_MAX } from '../themes';

interface Props {
  theme: Theme;
  onBack: () => void;
  onSubmit: (name: string, type: CounterType, max: number) => void;
}

export function CreateScreen({ theme: t, onBack, onSubmit }: Props) {
  const [formType, setFormType] = useState<CounterType | null>(null);
  const [name, setName] = useState('');
  const [maxStr, setMaxStr] = useState('');

  const isCustom = formType === 'custom';
  const customMax = parseInt(maxStr, 10);
  const nameOk = name.trim().length > 0;
  const maxOk = !isCustom || (customMax >= 2 && customMax <= 9999);
  const canSubmit = !!formType && nameOk && maxOk;

  function handleSubmit() {
    if (!canSubmit || !formType) return;
    const max = isCustom ? customMax : TYPE_MAX[formType];
    onSubmit(name.trim(), formType, max);
  }

  function borderFor(type: CounterType) {
    return formType === type ? `2px solid ${t.accent}` : `2px solid ${t.ringBorder}`;
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
          <div key={type} onClick={() => setFormType(type)}
            style={{ border: borderFor(type), background: t.face, borderRadius: 14, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ fontSize: 15.5, fontWeight: 600 }}>
              {type === 'frequency' ? 'Tần suất theo ngày' : type === 'daily' ? 'Điểm danh theo ngày' : 'Tùy chỉnh'}
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(238,241,243,0.5)', marginTop: 3 }}>
              {type === 'frequency' ? 'Đếm số lần trong ngày · thang 1–100' : type === 'daily' ? 'Đếm số ngày liên tiếp · thang 1–365' : 'Tự đặt giới hạn tối đa'}
            </div>
          </div>
        ))}

        {formType && (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', marginBottom: 8 }}>Tên bộ đếm</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Uống nước" style={inputStyle} />
            </div>
            {isCustom && (
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(238,241,243,0.5)', marginBottom: 8 }}>Giới hạn tối đa</div>
                <input value={maxStr} onChange={e => setMaxStr(e.target.value)} type="number" min={2} max={9999} placeholder="VD: 30"
                  style={{ ...inputStyle, fontFamily: "'JetBrains Mono',monospace" }} />
              </div>
            )}
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
