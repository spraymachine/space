import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import GlassCard from '../../../components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const els = sectionRef.current.querySelectorAll('.about-animate');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 30%', toggleActions: 'play none none reverse' },
    });
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p className="font-mono about-animate" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--mars-red)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Mars / About Me</p>
        <h2 className="about-animate" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '1.5rem' }}>About Me</h2>
        <GlassCard accent="rgb(193, 68, 14)" className="about-animate">
          <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: 'clamp(80px, 15vw, 120px)', height: 'clamp(80px, 15vw, 120px)', borderRadius: '50%', background: 'linear-gradient(135deg, var(--mars-red), #8B2500)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2rem' }}>M</span>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', lineHeight: 1.7, color: 'var(--text-dim)' }}>{about.bio}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
