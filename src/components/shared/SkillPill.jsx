export default function SkillPill({ name, accent }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        padding: '0.4rem 0.9rem',
        borderRadius: '100px',
        border: `1px solid ${accent || 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(255,255,255,0.03)',
        color: accent || 'var(--star-white)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      {name}
    </span>
  );
}
