import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import GlassCard from '../../../components/shared/GlassCard';
import SkillPill from '../../../components/shared/SkillPill';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({ orbitAngleRef, onOrbitStateChange }) {
  const sectionRef = useRef();
  const orbitContainerRef = useRef();
  const projectRefs = useRef([]);
  const headerRef = useRef();
  const hintRef = useRef();
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDirectionLocked = useRef(null); // 'horizontal' | 'vertical' | null
  const panelRef = useRef();
  const panelTouchStart = useRef(null);

  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const hasEnteredRef = useRef(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Sync orbiting state up to parent
  useEffect(() => {
    onOrbitStateChange?.(isOrbiting && !selectedProject);
  }, [isOrbiting, selectedProject, onOrbitStateChange]);

  // Sync angle to shared ref (for CameraRig)
  useEffect(() => {
    if (orbitAngleRef) {
      orbitAngleRef.current = orbitAngle;
    }
  }, [orbitAngle, orbitAngleRef]);

  // ScrollTrigger: pin section and toggle orbit mode
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=130%',
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.1) {
          setContentOpacity(p / 0.1);
        } else if (p > 0.85) {
          setContentOpacity(Math.max(0, (1 - p) / 0.15));
        } else {
          setContentOpacity(1);
        }
      },
      onEnter: () => {
        setIsOrbiting(true);
        if (!hasEnteredRef.current) {
          hasEnteredRef.current = true;
          setHasEntered(true);
        }
      },
      onLeave: () => {
        setIsOrbiting(false);
        setContentOpacity(0);
      },
      onEnterBack: () => setIsOrbiting(true),
      onLeaveBack: () => {
        setIsOrbiting(false);
        setContentOpacity(0);
      },
    });
    return () => trigger.kill();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Staggered entrance animation for project nodes
  useEffect(() => {
    if (!hasEntered) return;

    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    projectRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, scale: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          delay: 0.3 + i * 0.1,
          ease: 'back.out(1.7)',
        }
      );
    });

    if (hintRef.current) {
      gsap.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1.2 }
      );
    }
  }, [hasEntered]);

  // Drag handlers
  const handleDragStart = useCallback((clientX, clientY = 0) => {
    if (!isOrbiting || selectedProject) return;
    isDragging.current = true;
    lastX.current = clientX;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    touchDirectionLocked.current = null;
  }, [isOrbiting, selectedProject]);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging.current) return;
    const delta = (clientX - lastX.current) * (isMobile ? 0.005 : 0.005);
    lastX.current = clientX;
    setOrbitAngle(prev => prev + delta);
  }, [isMobile]);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    touchDirectionLocked.current = null;
  }, []);

  useEffect(() => {
    const el = orbitContainerRef.current;
    if (!el || !isOrbiting) return;

    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();

    const onTouchStart = (e) => {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);

      // Lock direction on first meaningful movement
      if (!touchDirectionLocked.current && (dx > 6 || dy > 6)) {
        touchDirectionLocked.current = dx > dy ? 'horizontal' : 'vertical';
      }

      if (touchDirectionLocked.current === 'horizontal') {
        e.preventDefault(); // only block scroll for horizontal drags
        handleDragMove(e.touches[0].clientX);
      }
      // vertical: do nothing, let scroll pass through
    };

    const onTouchEnd = () => handleDragEnd();

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOrbiting, handleDragStart, handleDragMove, handleDragEnd]);

  // Swipe-to-close for mobile detail panel
  const handlePanelTouchStart = useCallback((e) => {
    panelTouchStart.current = e.touches[0].clientY;
  }, []);

  const handlePanelTouchEnd = useCallback((e) => {
    if (panelTouchStart.current === null) return;
    const delta = e.changedTouches[0].clientY - panelTouchStart.current;
    if (delta > 80) setSelectedProject(null); // swipe down > 80px = close
    panelTouchStart.current = null;
  }, []);

  // Responsive orbit ring
  const getProjectPosition = (index, total) => {
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle;
    const radiusX = isMobile ? 36 : 40;
    const radiusY = isMobile ? 18 : 14;

    const x = 50 + Math.cos(baseAngle) * radiusX;
    const y = 50 + Math.sin(baseAngle) * radiusY;

    const depth = (Math.sin(baseAngle) + 1) / 2;
    const isBehind = depth > 0.45;
    const scale = isBehind ? 0 : 0.6 + 0.4 * (1 - depth);
    const zIndex = Math.round((1 - depth) * 10);
    const opacity = isBehind ? 0 : 0.4 + 0.6 * (1 - depth);

    return { x, y, scale, zIndex, opacity, isBehind };
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 3vh, 3rem)',
          left: 'clamp(1rem, 3vw, 3rem)',
          zIndex: 20,
          opacity: hasEntered ? contentOpacity : 0,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)',
            letterSpacing: '0.25em',
            color: 'var(--saturn-gold)',
            textTransform: 'uppercase',
          }}
        >
          Saturn / Projects
        </p>
        <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)', fontWeight: 700, marginTop: '0.25rem' }}>
          Orbital Works
        </h2>
      </div>

      {/* Orbit container — drag area */}
      <div
        ref={orbitContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: isOrbiting && !selectedProject ? 'grab' : 'default',
          touchAction: 'none',
          opacity: contentOpacity,
          transition: 'opacity 0.15s ease-out',
          pointerEvents: contentOpacity < 0.1 ? 'none' : 'auto',
        }}
      >
        {/* Orbit ring guides */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: isMobile ? '72%' : '80%',
            height: isMobile ? '36%' : '28%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(234, 214, 166, 0.06)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Drag hint */}
        {isOrbiting && !selectedProject && (
          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              bottom: 'clamp(1.5rem, 4vh, 4rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'dragHint 2s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: isMobile ? '1rem' : '1.2rem', opacity: 0.4, color: 'var(--saturn-gold)' }}>&#8592;</span>
              <div
                style={{
                  width: isMobile ? '30px' : '36px',
                  height: isMobile ? '30px' : '36px',
                  borderRadius: '50%',
                  border: '2px solid rgba(234, 214, 166, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'dragPulse 2s ease-in-out infinite',
                }}
              >
                <svg width={isMobile ? '14' : '18'} height={isMobile ? '14' : '18'} viewBox="0 0 24 24" fill="none" stroke="rgba(234,214,166,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                  <path d="M14 10V4a2 2 0 0 0-4 0v7" />
                  <path d="M10 10.5V8a2 2 0 0 0-4 0v8a6 6 0 0 0 12 0v-4a2 2 0 0 0-4 0" />
                </svg>
              </div>
              <span style={{ fontSize: isMobile ? '1rem' : '1.2rem', opacity: 0.4, color: 'var(--saturn-gold)' }}>&#8594;</span>
            </div>
            <p
              className="font-mono"
              style={{
                fontSize: isMobile ? '0.55rem' : '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--saturn-gold, #EAD6A6)',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {isMobile ? 'Swipe to explore · Tap a project' : 'Drag to explore · Click a project'}
            </p>
          </div>
        )}

        {/* Mobile: "Continue" exit CTA — only on mobile, always visible when orbiting */}
        {isMobile && isOrbiting && !selectedProject && (
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight * 2.5, behavior: 'smooth' })}
            className="font-mono"
            style={{
              position: 'absolute',
              top: 'clamp(0.75rem, 2vh, 1.25rem)',
              right: 'clamp(0.75rem, 4vw, 1.25rem)',
              zIndex: 25,
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(234,214,166,0.2)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: 'var(--saturn-gold)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              animation: 'fadeIn 0.5s ease-out',
              pointerEvents: 'auto',
            }}
            aria-label="Continue scrolling past Saturn"
          >
            Continue ↓
          </button>
        )}

        {/* Project nodes */}
        {projects.map((project, i) => {
          const pos = getProjectPosition(i, projects.length);
          return (
            <button
              key={project.id}
              ref={(el) => (projectRefs.current[i] = el)}
              onClick={() => !pos.isBehind && setSelectedProject(project)}
              aria-label={`View project: ${project.name}`}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
                zIndex: pos.zIndex,
                opacity: hasEntered ? pos.opacity : 0,
                border: 'none',
                background: 'transparent',
                cursor: pos.isBehind ? 'default' : 'pointer',
                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? '0.3rem' : '0.5rem',
                padding: '0.5rem',
                pointerEvents: pos.isBehind ? 'none' : 'auto',
              }}
            >
              <div
                style={{
                  width: isMobile ? 'clamp(24px, 8vw, 36px)' : 'clamp(28px, 4vw, 44px)',
                  height: isMobile ? 'clamp(24px, 8vw, 36px)' : 'clamp(28px, 4vw, 44px)',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${project.color}, ${project.color}66)`,
                  boxShadow: `0 0 12px ${project.color}55, 0 0 24px ${project.color}22`,
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: isMobile ? '0.4rem' : '0.5rem',
                  letterSpacing: '0.1em',
                  color: 'var(--star-white)',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 12px rgba(0,0,0,0.9)',
                }}
              >
                {project.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Backdrop overlay for mobile detail panel */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 25,
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
      )}

      {/* Project detail panel */}
      {selectedProject && (
        <div
          ref={panelRef}
          className="project-detail-panel"
          onTouchStart={handlePanelTouchStart}
          onTouchEnd={handlePanelTouchEnd}
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            right: isMobile ? 0 : 0,
            left: isMobile ? 0 : 'auto',
            bottom: isMobile ? 0 : 'auto',
            top: isMobile ? 'auto' : 0,
            width: isMobile ? '100%' : 'clamp(300px, 40vw, 450px)',
            maxHeight: isMobile ? '75vh' : 'none',
            height: isMobile ? 'auto' : '100%',
            zIndex: 30,
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            padding: isMobile ? '0' : 'clamp(1rem, 3vw, 2rem)',
            animation: 'slideInRight 0.4s ease-out',
            overflowY: isMobile ? 'auto' : 'visible',
            borderRadius: isMobile ? '20px 20px 0 0' : 0,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Swipe handle for mobile */}
          {isMobile && (
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '0.75rem 0 0.25rem',
              position: 'sticky',
              top: 0,
              zIndex: 5,
            }}>
              <div style={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.2)',
              }} />
            </div>
          )}
          <GlassCard
            accent={selectedProject.color}
            style={{
              width: '100%',
              borderRadius: isMobile ? '20px 20px 0 0' : '16px',
              paddingBottom: isMobile ? 'calc(1.25rem + env(safe-area-inset-bottom))' : undefined,
            }}
          >
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'var(--star-white)',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close project detail"
            >
              &times;
            </button>
            <p
              className="font-mono"
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: selectedProject.color,
                marginBottom: '0.5rem',
              }}
            >
              PROJECT
            </p>
            <h3
              style={{
                fontSize: 'clamp(1.1rem, 5vw, 1.5rem)',
                fontWeight: 700,
                marginBottom: '0.75rem',
                paddingRight: '2rem',
              }}
            >
              {selectedProject.name}
            </h3>
            <p
              style={{
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                lineHeight: 1.6,
                color: 'var(--text-dim)',
                marginBottom: '1rem',
              }}
            >
              {selectedProject.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
              {selectedProject.techStack.map((tech) => (
                <SkillPill key={tech} name={tech} accent={selectedProject.color} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.6rem 1.5rem',
                  borderRadius: '100px',
                  background: selectedProject.color,
                  color: '#000',
                  textDecoration: 'none',
                  textAlign: 'center',
                  flex: isMobile ? '1' : 'none',
                }}
              >
                View Live
              </a>
              {selectedProject.githubUrl !== '#' && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '0.6rem 1.5rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--star-white)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    flex: isMobile ? '1' : 'none',
                  }}
                >
                  GitHub
                </a>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
