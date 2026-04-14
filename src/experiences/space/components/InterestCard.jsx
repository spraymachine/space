import { useCallback, useRef } from 'react';

export default function InterestCard({ interest, onDismiss }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const touchStartY = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80) onDismiss();
    touchStartY.current = null;
  }, [onDismiss]);

  if (!interest) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 60,
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Card */}
      <div
        className="interest-detail-card"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        style={{
          position: 'fixed',
          zIndex: 65,
          ...(isMobile
            ? {
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '20px 20px 0 0',
                animation: 'slideUpInterest 0.4s ease-out',
              }
            : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '16px',
                animation: 'popIn 0.3s ease-out',
              }),
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: isMobile ? '1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom))' : '2rem',
          textAlign: 'center',
          maxWidth: isMobile ? '100%' : '320px',
          width: isMobile ? '100%' : 'auto',
          minWidth: isMobile ? 'auto' : '280px',
        }}
      >
        {/* Mobile swipe handle */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.2)',
            }} />
          </div>
        )}

        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
          {interest.emoji}
        </div>

        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: interest.color || '#FFD700',
            marginBottom: '0.5rem',
          }}
        >
          DISCOVERED
        </p>

        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--star-white)',
          marginBottom: '0.5rem',
        }}>
          {interest.name}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: 'var(--text-dim)',
        }}>
          {interest.description}
        </p>

        <p style={{
          marginTop: '1.25rem',
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.2)',
        }}>
          {isMobile ? 'swipe down to dismiss' : 'click anywhere to dismiss'}
        </p>
      </div>
    </>
  );
}
