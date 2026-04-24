import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import ContactForm from '../../../components/shared/ContactForm';

gsap.registerPlugin(ScrollTrigger);

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M5.5 4.75h3.2c.45 0 .84.31.94.75l.74 3.15c.08.35-.04.71-.31.95l-1.82 1.64a13.6 13.6 0 0 0 6.56 6.56l1.64-1.82c.24-.27.6-.39.95-.31l3.15.74c.44.1.75.49.75.94v3.2c0 .55-.43 1.01-.98.99C11.32 22.5 1.5 12.68 1.51 5.73c-.02-.55.44-.98.99-.98Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M4.5 6.75h15c.69 0 1.25.56 1.25 1.25v8c0 .69-.56 1.25-1.25 1.25h-15c-.69 0-1.25-.56-1.25-1.25v-8c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m5.75 8.5 6.25 5 6.25-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

        {/* Meta row — copy + contact icons + availability */}
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

          {/* Contact icons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              {
                href: 'tel:+918919760762',
                label: 'Call Mani',
                icon: <PhoneIcon />,
                accent: 'rgba(115,194,190,0.9)',
                glow: 'rgba(115,194,190,0.35)',
              },
              {
                href: 'mailto:ceo@manidodla.in',
                label: 'Email Mani',
                icon: <MailIcon />,
                accent: 'rgba(61,95,196,0.95)',
                glow: 'rgba(61,95,196,0.38)',
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: `1px solid ${item.glow}`,
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 55%, rgba(0,0,0,0.12) 100%)`,
                  color: item.accent,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxShadow: `0 0 18px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1), box-shadow 0.35s cubic-bezier(0.32,0.72,0,1), border-color 0.35s cubic-bezier(0.32,0.72,0,1)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.06)';
                  e.currentTarget.style.boxShadow = `0 0 26px ${item.glow}, 0 0 42px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)`;
                  e.currentTarget.style.borderColor = item.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 0 18px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`;
                  e.currentTarget.style.borderColor = item.glow;
                }}
              >
                <span style={{ width: '20px', height: '20px', display: 'block', filter: 'drop-shadow(0 0 8px currentColor)' }}>
                  {item.icon}
                </span>
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
