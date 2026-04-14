import { useState, useEffect, useRef } from 'react';
import { interests } from '../data/interests';

export default function DiscoveryCounter({ discoveredCount, visible }) {
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(discoveredCount);
  const total = interests.length;
  const allFound = discoveredCount === total;

  useEffect(() => {
    if (discoveredCount > prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 800);
      prevCount.current = discoveredCount;
      return () => clearTimeout(timer);
    }
  }, [discoveredCount]);

  if (!visible) return null;

  return (
    <div
      className="font-mono"
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 3vh, 2rem)',
        right: 'clamp(1rem, 3vw, 2rem)',
        zIndex: 50,
        background: pulse || allFound
          ? 'rgba(255, 215, 0, 0.12)'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${
          pulse || allFound
            ? 'rgba(255, 215, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '20px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        transition: 'all 0.4s ease',
        boxShadow: pulse || allFound
          ? '0 0 20px rgba(255, 215, 0, 0.15)'
          : 'none',
        animation: 'fadeIn 0.5s ease-out',
        pointerEvents: 'none',
      }}
    >
      <span style={{
        color: '#FFD700',
        fontSize: '0.65rem',
        transition: 'transform 0.3s ease',
        transform: pulse ? 'scale(1.3)' : 'scale(1)',
        display: 'inline-block',
      }}>
        ✦
      </span>
      <span style={{
        color: pulse || allFound ? '#FFD700' : 'rgba(255, 255, 255, 0.6)',
        fontWeight: pulse || allFound ? 600 : 400,
        transition: 'color 0.4s ease, font-weight 0.4s ease',
      }}>
        {discoveredCount} / {total}
      </span>
    </div>
  );
}
