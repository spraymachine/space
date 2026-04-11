import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '../data/testimonials';
import GlassCard from '../../../components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll('.testimonial-card');
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--uranus-teal)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Uranus / Testimonials</p>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem' }}>Voices from Afar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {testimonials.map((t) => (
            <GlassCard key={t.id} accent="rgb(115, 194, 190)" className="testimonial-card" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '0.5rem', left: '1rem', fontSize: '3rem', color: 'var(--uranus-teal)', opacity: 0.2, lineHeight: 1, fontFamily: 'serif' }}>&ldquo;</span>
              <p style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontStyle: 'italic', lineHeight: 1.7, color: 'rgba(232,244,248,0.8)', marginBottom: '1rem', paddingTop: '0.5rem' }}>{t.quote}</p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</p>
              <p className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{t.role}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
