import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import ContactForm from '../../../components/shared/ContactForm';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef  = useRef();
  const line1Ref    = useRef();
  const line2Ref    = useRef();
  const line3Ref    = useRef();
  const metaRef     = useRef();
  const stripRef    = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 58%',
        toggleActions: 'play none none reverse',
      },
    });

    // Staggered heading line reveals — slide up from clip
    [line1Ref, line2Ref, line3Ref].forEach((ref, i) => {
      tl.fromTo(ref.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out' },
        i * 0.08
      );
    });

    tl.fromTo(metaRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.35
    );

    tl.fromTo(stripRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.5
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(4rem, 9vw, 7rem) clamp(2rem, 7vw, 6rem) clamp(3rem, 6vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Decorative orbit ring (SVG arc, top-right) ── */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-12%',
          width: 'clamp(340px, 48vw, 680px)',
          height: 'clamp(340px, 48vw, 680px)',
          pointerEvents: 'none',
          opacity: 0.07,
        }}
        viewBox="0 0 680 680"
        fill="none"
      >
        <circle cx="340" cy="340" r="330" stroke="var(--neptune-blue)" strokeWidth="1.5" />
        <circle cx="340" cy="340" r="260" stroke="var(--neptune-blue)" strokeWidth="0.75" strokeDasharray="4 12" />
      </svg>

      {/* ── TOP: billboard heading block ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Eyebrow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--neptune-blue)',
            boxShadow: '0 0 8px var(--neptune-blue)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--neptune-blue)',
            opacity: 0.8,
          }}>
            Neptune / Contact
          </span>
        </div>

        {/* Heading — line-by-line reveals */}
        <h2 style={{ margin: 0, padding: 0 }}>
          {[["Let's build", line1Ref], ["something", line2Ref], ["great.", line3Ref]].map(([text, ref]) => (
            <div key={text} style={{ overflow: 'hidden', lineHeight: 1 }}>
              <span
                ref={ref}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--star-white)',
                  lineHeight: 1.05,
                  opacity: 0,
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </h2>

        {/* Meta row — copy + social links + availability */}
        <div
          ref={metaRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginTop: 'clamp(1.75rem, 3.5vw, 3rem)',
            opacity: 0,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
            color: 'rgba(232,244,248,0.4)',
            lineHeight: 1.6,
            maxWidth: '38ch',
            margin: 0,
          }}>
            Open to roles, collabs, and ambitious projects.
          </p>

          {/* Divider */}
          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

          {/* Social pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {about.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(232,244,248,0.45)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.4s cubic-bezier(0.32,0.72,0,1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(61,95,196,0.45)';
                  e.currentTarget.style.color = 'var(--star-white)';
                  e.currentTarget.style.background = 'rgba(61,95,196,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(232,244,248,0.45)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {s.platform}
              </a>
            ))}
          </div>

          {/* Resume */}
          <a
            href={about.resumeUrl}
            download
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(232,244,248,0.3)',
              textDecoration: 'none',
              transition: 'color 0.3s cubic-bezier(0.32,0.72,0,1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--star-white)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(232,244,248,0.3)'; }}
          >
            Résumé ↓
          </a>
        </div>
      </div>

      {/* ── BOTTOM: form strip ── */}
      <div ref={stripRef} style={{ opacity: 0, paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <ContactForm />
      </div>
    </section>
  );
}
