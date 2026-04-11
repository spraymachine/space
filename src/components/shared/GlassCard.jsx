import { useState } from 'react';

export default function GlassCard({ children, accent, className = '', style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`glass ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered && accent ? accent.replace(')', ', 0.2)').replace('rgb', 'rgba') : undefined,
        boxShadow: hovered && accent ? `0 8px 32px ${accent.replace(')', ', 0.08)').replace('rgb', 'rgba')}` : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
