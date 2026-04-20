import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import ContactForm from '../../../components/shared/ContactForm';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  github: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

export default function ContactSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const rows = sectionRef.current.querySelectorAll('.contact-row');
    gsap.fromTo(rows,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 6vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>

        {/* ── Header block ── */}
        <div className="contact-row" style={{ opacity: 0, marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.25rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.28em',
              color: 'var(--neptune-blue)',
              textTransform: 'uppercase',
              opacity: 0.75,
            }}>
              Neptune / Contact
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            color: 'var(--star-white)',
            marginBottom: '1.25rem',
          }}>
            Let's talk.
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            color: 'rgba(232,244,248,0.45)',
            lineHeight: 1.75,
            maxWidth: '48ch',
          }}>
            Open to collabs, full-time roles, or just a good conversation.
            Drop a message — I read every one.
          </p>
        </div>

        {/* ── Form ── */}
        <div className="contact-row" style={{ opacity: 0, marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <ContactForm />
        </div>

        {/* ── Footer row: socials + resume ── */}
        <div className="contact-row" style={{
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {about.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  color: 'rgba(232,244,248,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease, background 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--star-white)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(232,244,248,0.35)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {SOCIAL_ICONS[s.icon]}
              </a>
            ))}
          </div>

          {/* Resume link */}
          <a
            href={about.resumeUrl}
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,244,248,0.4)',
              textDecoration: 'none',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--star-white)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(232,244,248,0.4)'; }}
          >
            <span>Resume</span>
            <span style={{ fontSize: '0.75rem' }}>↓</span>
          </a>
        </div>

      </div>
    </section>
  );
}
