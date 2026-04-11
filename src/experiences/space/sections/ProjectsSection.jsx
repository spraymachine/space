import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import { useOrbitControls } from '../hooks/useOrbitControls';
import GlassCard from '../../../components/shared/GlassCard';
import SkillPill from '../../../components/shared/SkillPill';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef();
  const orbitContainerRef = useRef();
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAngleChange = useCallback((newAngle) => { setOrbitAngle(newAngle); }, []);

  useOrbitControls(orbitContainerRef, { enabled: isOrbiting && !selectedProject, onAngleChange: handleAngleChange });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      onEnter: () => setIsOrbiting(true),
      onLeave: () => setIsOrbiting(false),
      onEnterBack: () => setIsOrbiting(true),
      onLeaveBack: () => setIsOrbiting(false),
    });
    return () => trigger.kill();
  }, []);

  const getProjectPosition = (index, total) => {
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle;
    const radius = 38;
    const x = 50 + Math.cos(baseAngle) * radius;
    const y = 50 + Math.sin(baseAngle) * radius * 0.4;
    const scale = 0.6 + 0.4 * ((Math.sin(baseAngle) + 1) / 2);
    const zIndex = Math.round(scale * 10);
    const opacity = 0.3 + 0.7 * scale;
    return { x, y, scale, zIndex, opacity };
  };

  return (
    <section ref={sectionRef} id="projects" style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 'clamp(1.5rem, 4vh, 3rem)', left: 'clamp(1.5rem, 4vw, 3rem)', zIndex: 20 }}>
        <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--saturn-gold)', textTransform: 'uppercase' }}>Saturn / Projects</p>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 700, marginTop: '0.25rem' }}>Orbital Works</h2>
      </div>

      <div ref={orbitContainerRef} style={{ position: 'relative', width: '100%', height: '100%', cursor: isOrbiting ? 'grab' : 'default', touchAction: 'none' }}>
        {isOrbiting && !selectedProject && (
          <p className="font-mono" style={{ position: 'absolute', bottom: 'clamp(2rem, 5vh, 3rem)', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text-dim)', textTransform: 'uppercase', zIndex: 20 }}>
            Drag to orbit &middot; Tap a project
          </p>
        )}

        {projects.map((project, i) => {
          const pos = getProjectPosition(i, projects.length);
          return (
            <button key={project.id} onClick={() => setSelectedProject(project)} aria-label={`View project: ${project.name}`}
              style={{
                position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`, zIndex: pos.zIndex, opacity: pos.opacity,
                border: 'none', background: 'transparent', cursor: 'pointer', transition: 'opacity 0.3s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
              }}>
              <div style={{
                width: 'clamp(32px, 5vw, 48px)', height: 'clamp(32px, 5vw, 48px)', borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${project.color}, ${project.color}88)`,
                boxShadow: `0 0 20px ${project.color}44, 0 0 40px ${project.color}22`,
              }} />
              <span className="font-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--star-white)', whiteSpace: 'nowrap', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                {project.name}
              </span>
            </button>
          );
        })}
      </div>

      {selectedProject && (
        <div className="project-detail-panel" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 'clamp(300px, 40vw, 450px)',
          zIndex: 30, display: 'flex', alignItems: 'center', padding: 'clamp(1rem, 3vw, 2rem)',
        }}>
          <GlassCard accent={selectedProject.color} style={{ width: '100%' }}>
            <button onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }} aria-label="Close project detail">&times;</button>
            <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: selectedProject.color, marginBottom: '0.5rem' }}>PROJECT</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '0.75rem' }}>{selectedProject.name}</h3>
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', background: `linear-gradient(135deg, ${selectedProject.color}22, ${selectedProject.color}08)`, border: '1px solid rgba(255,255,255,0.04)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Screenshot</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: '1rem' }}>{selectedProject.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {selectedProject.techStack.map((tech) => (<SkillPill key={tech} name={tech} accent={selectedProject.color} />))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.5rem 1.25rem', borderRadius: '100px', background: selectedProject.color, color: '#000', textDecoration: 'none' }}>View Live</a>
              <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--star-white)', textDecoration: 'none' }}>GitHub</a>
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
