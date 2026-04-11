export default function ExperienceSelector({ navigate }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button
        onClick={() => navigate('/space')}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          color: '#E8F4F8',
          background: 'transparent',
          border: '1px solid rgba(232,244,248,0.15)',
          padding: '1rem 2rem',
          borderRadius: '100px',
          cursor: 'pointer',
        }}
      >
        ENTER SPACE
      </button>
    </div>
  );
}
