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

  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const hasEnteredRef = useRef(false);

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
      end: '+=200%',
      pin: true,
      onUpdate: (self) => {
        // Fade in during first 10%, hold, fade out during last 10% of pin
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

    // Animate header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    // Stagger project nodes in from the ring edges
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

    // Hint text
    if (hintRef.current) {
      gsap.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1.2 }
      );
    }
  }, [hasEntered]);

  // Drag handlers — orbit angle drives both DOM ring positions AND 3D camera
  const handleDragStart = useCallback((clientX) => {
    if (!isOrbiting || selectedProject) return;
    isDragging.current = true;
    lastX.current = clientX;
  }, [isOrbiting, selectedProject]);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging.current) return;
    const delta = (clientX - lastX.current) * 0.005;
    lastX.current = clientX;
    setOrbitAngle(prev => prev + delta);
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const el = orbitContainerRef.current;
    if (!el || !isOrbiting) return;

    const onMouseDown = (e) => handleDragStart(e.clientX);
    const onMouseMove = (e) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e) => { e.preventDefault(); handleDragMove(e.touches[0].clientX); };
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

  // Position projects in an elliptical ring aligned to Saturn's ring tilt
  const getProjectPosition = (index, total) => {
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle;
    const radiusX = 40; // horizontal stretch
    const radiusY = 14; // vertical compress (ring tilt perspective)

    const x = 50 + Math.cos(baseAngle) * radiusX;
    const y = 50 + Math.sin(baseAngle) * radiusY;

    // Depth simulation — items "behind" Saturn are smaller/dimmer
    const depth = (Math.sin(baseAngle) + 1) / 2; // 0 = front, 1 = back
    const scale = 0.55 + 0.45 * (1 - depth);
    const zIndex = Math.round((1 - depth) * 10);
    const opacity = 0.25 + 0.75 * (1 - depth);

    return { x, y, scale, zIndex, opacity, isBehind: depth > 0.6 };
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
          top: 'clamp(1.5rem, 4vh, 3rem)',
          left: 'clamp(1.5rem, 4vw, 3rem)',
          zIndex: 20,
          opacity: hasEntered ? contentOpacity : 0,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--saturn-gold)',
            textTransform: 'uppercase',
          }}
        >
          Saturn / Projects
        </p>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 700, marginTop: '0.25rem' }}>
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
        {/* Orbit ring guides (subtle visual ring) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '80%',
            height: '28%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(234, 214, 166, 0.06)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '84%',
            height: '30%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(234, 214, 166, 0.03)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Drag hint */}
        {isOrbiting && !selectedProject && (
          <p
            ref={hintRef}
            className="font-mono"
            style={{
              position: 'absolute',
              bottom: 'clamp(2rem, 5vh, 3rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              zIndex: 20,
              opacity: 0,
            }}
          >
            Drag to orbit &middot; Tap a project
          </p>
        )}

        {/* Project nodes — positioned along the ring */}
        {projects.map((project, i) => {
          const pos = getProjectPosition(i, projects.length);
          return (
            <button
              key={project.id}
              ref={(el) => (projectRefs.current[i] = el)}
              onClick={() => setSelectedProject(project)}
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
                gap: '0.5rem',
                padding: '0.5rem',
                pointerEvents: pos.isBehind ? 'none' : 'auto',
              }}
            >
              {/* Glowing orb */}
              <div
                style={{
                  width: 'clamp(28px, 4vw, 44px)',
                  height: 'clamp(28px, 4vw, 44px)',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${project.color}, ${project.color}66)`,
                  boxShadow: `0 0 15px ${project.color}55, 0 0 30px ${project.color}22, inset 0 0 8px ${project.color}33`,
                  transition: 'box-shadow 0.3s ease',
                }}
              />
              {/* Label */}
              <span
                className="font-mono"
                style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.12em',
                  color: pos.isBehind ? 'rgba(232,244,248,0.3)' : 'var(--star-white)',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 12px rgba(0,0,0,0.9)',
                  transition: 'color 0.3s ease',
                }}
              >
                {project.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Project detail panel — slides in from right (bottom sheet on mobile) */}
      {selectedProject && (
        <div
          className="project-detail-panel"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(300px, 40vw, 450px)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            padding: 'clamp(1rem, 3vw, 2rem)',
            animation: 'slideInRight 0.4s ease-out',
          }}
        >
          <GlassCard accent={selectedProject.color} style={{ width: '100%' }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '1.2rem',
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
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              {selectedProject.name}
            </h3>
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${selectedProject.color}22, ${selectedProject.color}08)`,
                border: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                Screenshot
              </span>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--text-dim)',
                marginBottom: '1rem',
              }}
            >
              {selectedProject.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {selectedProject.techStack.map((tech) => (
                <SkillPill key={tech} name={tech} accent={selectedProject.color} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '100px',
                  background: selectedProject.color,
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                View Live
              </a>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--star-white)',
                  textDecoration: 'none',
                }}
              >
                GitHub
              </a>
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
