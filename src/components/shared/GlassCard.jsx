import { useState } from 'react';

export default function GlassCard({ children, accent, className = '', style = {} }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`glass ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      style={{
        padding: 'clamp(1rem, 3vw, 1.75rem)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        transform: active ? 'translateY(-2px)' : 'translateY(0)',
        borderColor: active && accent ? accent.replace(')', ', 0.15)').replace('rgb', 'rgba') : undefined,
        boxShadow: active && accent ? `0 4px 24px ${accent.replace(')', ', 0.06)').replace('rgb', 'rgba')}` : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
