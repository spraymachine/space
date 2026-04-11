import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import ContactForm from '../../../components/shared/ContactForm';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

export default function ContactSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const els = sectionRef.current.querySelectorAll('.contact-animate');
    gsap.fromTo(els, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
  }, []);

  return (
    <section ref={sectionRef} id="contact" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p className="font-mono contact-animate" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--neptune-blue)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Neptune / Contact</p>
        <h2 className="contact-animate" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>Send a Signal</h2>
        <p className="contact-animate" style={{ color: 'var(--text-dim)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', marginBottom: '2rem', lineHeight: 1.6 }}>
          You've reached the edge of the solar system. Let's build something across the cosmos.
        </p>
        <div className="contact-animate"><ContactForm /></div>
        <div className="contact-animate" style={{ marginTop: '2rem' }}>
          <a href={about.resumeUrl} download style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 500,
            padding: '0.7rem 1.7rem', border: '1px solid rgba(232,244,248,0.15)', borderRadius: '100px', color: 'var(--star-white)', textDecoration: 'none', transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(232,244,248,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(232,244,248,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Download Resume
          </a>
        </div>
        <div className="contact-animate" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {about.socials.map((s) => (
            <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
              style={{ color: 'var(--text-dim)', transition: 'color 0.3s ease, transform 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neptune-blue)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {SOCIAL_ICONS[s.icon]}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
