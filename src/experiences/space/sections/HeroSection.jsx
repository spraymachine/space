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
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, var(--star-white) 0%, var(--earth-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {about.name}
        </h1>
      </div>
    </section>
  );
}
