import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGpuTier } from './hooks/useGpuTier';
import { useScrollCamera } from './hooks/useScrollCamera';
import BigBang from './canvas/effects/BigBang';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const SpaceCanvas = lazy(() => import('./canvas/SpaceCanvas'));

export default function SpaceExperience({ navigate }) {
  const gpuTier = useGpuTier();
  const scrollProgressRef = useScrollCamera();
  const [introComplete, setIntroComplete] = useState(false);
  const lenisRef = useRef(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared orbit state between ProjectsSection (DOM) and CameraRig (3D)
  const orbitAngleRef = useRef(0);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // Skip Big Bang for reduced motion users
  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroComplete(true);
    }
  }, [prefersReducedMotion]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Prevent scroll during Big Bang
  useEffect(() => {
    if (!introComplete && lenisRef.current) {
      lenisRef.current.stop();
    } else if (introComplete && lenisRef.current) {
      lenisRef.current.start();
    }
  }, [introComplete]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Skip to content link */}
      <a
        href="#about"
        style={{
          position: 'fixed',
          top: '-100px',
          left: '1rem',
          zIndex: 99999,
          background: 'var(--sun-gold)',
          color: '#000',
          padding: '0.5rem 1rem',
          borderRadius: '0 0 8px 8px',
          fontWeight: 600,
          fontSize: '0.8rem',
          textDecoration: 'none',
          transition: 'top 0.3s ease',
        }}
        onFocus={(e) => e.currentTarget.style.top = '0'}
        onBlur={(e) => e.currentTarget.style.top = '-100px'}
      >
        Skip to content
      </a>

      {/* Big Bang intro overlay */}
      {!prefersReducedMotion && <BigBang onComplete={() => setIntroComplete(true)} />}

      {/* 3D Canvas — fixed behind everything */}
      <Suspense fallback={null}>
        <SpaceCanvas
          gpuTier={gpuTier}
          scrollProgressRef={scrollProgressRef}
          orbitAngleRef={orbitAngleRef}
          isOrbiting={isOrbiting}
        />
      </Suspense>

      {/* Scrollable DOM content */}
      <div
        id="space-scroll-container"
        style={{
          position: 'relative',
          zIndex: 2,
          pointerEvents: introComplete ? 'auto' : 'none',
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection
          orbitAngleRef={orbitAngleRef}
          onOrbitStateChange={setIsOrbiting}
        />
        <TestimonialsSection />
        <ContactSection />

        {/* Footer void — "Back to Earth" */}
        <footer
          style={{
            minHeight: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => {
              lenisRef.current?.scrollTo(0, { duration: 2 });
            }}
            className="font-mono"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--star-white)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            &larr; Back to Earth
          </button>
        </footer>
      </div>
    </div>
  );
}
