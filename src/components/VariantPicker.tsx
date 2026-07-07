import type { Variant, Theme } from '../types';
import { THEMES } from '../themes';

interface Props {
  current: Variant;
  onChange: (v: Variant) => void;
  theme: Theme;
}

const LABELS: Record<Variant, string> = { a: 'Amber', b: 'Teal', c: 'Red' };

export function VariantPicker({ current, onChange, theme: t }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '8px 16px 0' }}>
      {(['a', 'b', 'c'] as Variant[]).map(v => (
        <button key={v} onClick={() => onChange(v)}
          style={{
            width: 28, height: 28, borderRadius: 100, border: current === v ? `2px solid ${t.accent}` : '2px solid transparent',
            background: THEMES[v].accent, cursor: 'pointer', transition: 'border .2s',
            boxShadow: current === v ? `0 0 8px ${THEMES[v].accentShadow}` : 'none',
          }}
          title={LABELS[v]}
        />
      ))}
    </div>
  );
}
