import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { about } from '../data/about';

export default function HeroSection() {
  const contentRef = useRef();

  useEffect(() => {
    const el = contentRef.current;
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1.2, delay: 3.5, ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 5vw, 3rem)',
        position: 'relative',
      }}
    >
      <div ref={contentRef} style={{ textAlign: 'center', opacity: 0 }}>
        <p className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          Welcome aboard
        </p>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, var(--star-white) 0%, var(--earth-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {about.name}
        </h1>
        <p className="font-mono" style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--earth-blue)' }}>
          {about.title}
        </p>
        <div style={{ position: 'absolute', bottom: 'clamp(2rem, 5vh, 3rem)', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Scroll to explore</span>
          <div style={{ width: '1px', height: '24px', background: 'linear-gradient(180deg, var(--earth-blue), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
