import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '../data/testimonials';

gsap.registerPlugin(ScrollTrigger);

function TestimonialCard({ t, featured }) {
  return (
    /* Outer bezel shell */
    <div
      className="testimonial-reveal"
      style={{
        background: featured ? 'rgba(115,194,190,0.045)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${featured ? 'rgba(115,194,190,0.14)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '24px',
        padding: '2px',
        height: '100%',
        transition: 'border-color 0.7s cubic-bezier(0.32,0.72,0,1), transform 0.7s cubic-bezier(0.32,0.72,0,1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = featured ? 'rgba(115,194,190,0.32)' : 'rgba(255,255,255,0.14)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = featured ? 'rgba(115,194,190,0.14)' : 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Inner core */}
      <div style={{
        background: featured
          ? 'linear-gradient(145deg, rgba(115,194,190,0.06) 0%, rgba(0,0,0,0.2) 100%)'
          : 'rgba(255,255,255,0.025)',
        borderRadius: '22px',
        padding: featured ? 'clamp(1.75rem, 3vw, 2.75rem)' : '1.5rem 1.75rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient radial glow (featured only) */}
        {featured && (
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(115,194,190,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Quote mark */}
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: featured ? 'clamp(5rem, 9vw, 8rem)' : '5rem',
          lineHeight: 0.65,
          marginBottom: featured ? '1.25rem' : '0.75rem',
          background: `linear-gradient(160deg, ${featured ? 'rgba(115,194,190,1)' : 'rgba(255,255,255,0.4)'} 0%, ${featured ? 'rgba(115,194,190,0.25)' : 'rgba(255,255,255,0.1)'} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none',
        }}>&ldquo;</div>

        {/* Quote text */}
        <p style={{
          fontSize: featured ? 'clamp(0.9rem, 1.4vw, 1.05rem)' : '0.82rem',
          lineHeight: featured ? 1.8 : 1.72,
          color: featured ? 'rgba(232,244,248,0.82)' : 'rgba(232,244,248,0.6)',
          flexGrow: 1,
          marginBottom: '1.75rem',
          letterSpacing: '0.01em',
        }}>
          {t.quote}
        </p>

        {/* Hairline divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: featured
            ? 'linear-gradient(90deg, rgba(115,194,190,0.2), transparent)'
            : 'rgba(255,255,255,0.05)',
          marginBottom: '1.25rem',
        }} />

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar */}
          <div style={{
            width: featured ? '40px' : '34px',
            height: featured ? '40px' : '34px',
            borderRadius: '50%',
            background: featured
              ? 'linear-gradient(135deg, rgba(115,194,190,0.35), rgba(61,95,196,0.35))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
            border: `1px solid ${featured ? 'rgba(115,194,190,0.25)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span className="font-mono" style={{
              fontSize: featured ? '0.65rem' : '0.6rem',
              color: featured ? 'var(--uranus-teal)' : 'rgba(232,244,248,0.5)',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {t.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>

          <div>
            <p style={{
              fontWeight: 600,
              fontSize: featured ? '0.88rem' : '0.8rem',
              color: 'var(--star-white)',
              lineHeight: 1.25,
              marginBottom: '0.2rem',
            }}>
              {t.name}
            </p>
            <p className="font-mono" style={{
              fontSize: '0.52rem',
              color: featured ? 'var(--uranus-teal)' : 'var(--text-dim)',
              letterSpacing: '0.12em',
              opacity: featured ? 0.75 : 0.6,
            }}>
              {t.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll('.testimonial-reveal');
    gsap.fromTo(cards,
      { opacity: 0, y: 48, filter: 'blur(10px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.0, stagger: 0.2,
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
      id="testimonials"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orb */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '-5%',
        width: '45vw',
        height: '45vw',
        background: 'radial-gradient(ellipse, rgba(115,194,190,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1060px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--uranus-teal)', opacity: 0.55, display: 'inline-block' }} />
            <span className="font-mono" style={{
              fontSize: '0.55rem',
              letterSpacing: '0.28em',
              color: 'var(--uranus-teal)',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}>
              Uranus / Testimonials
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            background: 'linear-gradient(135deg, var(--star-white) 30%, rgba(115,194,190,0.65) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Voices<br />from Afar
          </h2>
        </div>

        {/* Bento grid: featured left (span 2 rows) + two stacked right */}
        <div className="testimonials-grid">
          <div className="testimonial-featured">
            <TestimonialCard t={testimonials[0]} featured />
          </div>
          <TestimonialCard t={testimonials[1]} />
          <TestimonialCard t={testimonials[2]} />
        </div>
      </div>
    </section>
  );
}
