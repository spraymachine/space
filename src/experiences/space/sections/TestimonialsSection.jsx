import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TestimonialsSection — DOM container for the Uranus orbit.
 *
 * The actual testimonial cards are rendered as 3D entities in the Three.js scene
 * (see UranusTestimonialOrbit.jsx) so they're genuinely attached to Uranus and
 * revolve automatically. This section only provides scroll room, the eyebrow
 * header, and the pause/resume control.
 */

export default function TestimonialsSection({ isPaused, onTogglePause }) {
  const sectionRef = useRef();
  const headerRef = useRef();
  const hintRef = useRef();

  // Scroll-in reveal for header + hint
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(headerRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    );
    tl.fromTo(hintRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.45'
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        minHeight: '130vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem) 3rem',
        position: 'relative',
      }}
    >
      {/* Header block — sits at top, 3D cards revolve behind / around Uranus below it */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          opacity: 0,
          position: 'relative',
          zIndex: 5,
          maxWidth: '640px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.1rem',
          }}
        >
          <span
            style={{
              width: '22px',
              height: '1px',
              background: 'var(--uranus-teal)',
              opacity: 0.45,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              color: 'var(--uranus-teal)',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            Uranus / Testimonials
          </span>
          <span
            style={{
              width: '22px',
              height: '1px',
              background: 'var(--uranus-teal)',
              opacity: 0.45,
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.0,
            color: 'var(--star-white)',
            margin: 0,
          }}
        >
          Words in orbit.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)',
            lineHeight: 1.65,
            color: 'rgba(232,244,248,0.5)',
            margin: '1rem auto 0',
            maxWidth: '44ch',
          }}
        >
          Three voices, slowly circling Uranus. Tap any card to pause the orbit.
        </p>
      </div>

      {/* Pause/resume control */}
      <div
        ref={hintRef}
        style={{
          marginTop: '1.75rem',
          opacity: 0,
          position: 'relative',
          zIndex: 5,
        }}
      >
        <button
          type="button"
          onClick={onTogglePause}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0.95rem 0.5rem 0.55rem',
            borderRadius: '100px',
            border: '1px solid rgba(115,194,190,0.24)',
            background: 'rgba(115,194,190,0.05)',
            color: 'var(--uranus-teal)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition:
              'border-color 0.4s cubic-bezier(0.32,0.72,0,1), background 0.4s cubic-bezier(0.32,0.72,0,1), transform 0.4s cubic-bezier(0.32,0.72,0,1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(115,194,190,0.55)';
            e.currentTarget.style.background = 'rgba(115,194,190,0.11)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(115,194,190,0.24)';
            e.currentTarget.style.background = 'rgba(115,194,190,0.05)';
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={isPaused ? 'Resume testimonial orbit' : 'Pause testimonial orbit'}
        >
          <span
            aria-hidden="true"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(115,194,190,0.16)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.58rem',
              lineHeight: 1,
              color: 'var(--uranus-teal)',
            }}
          >
            {isPaused ? '▶' : '‖'}
          </span>
          {isPaused ? 'Resume orbit' : 'Pause orbit'}
        </button>
      </div>

      {/* Paused-state subtle indicator */}
      {isPaused && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '2rem',
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            background: 'rgba(10,18,22,0.7)',
            border: '1px solid rgba(115,194,190,0.2)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(115,194,190,0.8)',
            pointerEvents: 'none',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 5,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--uranus-teal)',
              boxShadow: '0 0 10px var(--uranus-teal)',
            }}
          />
          Orbit paused
        </div>
      )}
    </section>
  );
}
