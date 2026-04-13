import { useState } from 'react';

export default function SkillPill({ name, accent }) {
  const [active, setActive] = useState(false);

  return (
    <span
      className="font-mono"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      style={{
        fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)',
        letterSpacing: '0.1em',
        padding: '0.35rem 0.75rem',
        borderRadius: '100px',
        border: `1px solid ${accent || 'rgba(255,255,255,0.08)'}`,
        background: active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        color: accent || 'var(--star-white)',
        transition: 'all 0.2s ease',
        transform: active ? 'translateY(-1px)' : 'translateY(0)',
        cursor: 'default',
        display: 'inline-block',
      }}
    >
      {name}
    </span>
  );
}
