import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategories } from '../data/skills';
import SkillPill from '../../../components/shared/SkillPill';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const categories = sectionRef.current.querySelectorAll('.skill-category');
    categories.forEach((cat) => {
      gsap.fromTo(cat, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: cat, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="skills" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--jupiter-amber)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Jupiter / Skills</p>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem' }}>Technical Arsenal</h2>
        {skillCategories.map((category) => (
          <div key={category.name} className="skill-category" style={{ marginBottom: '2rem' }}>
            <p className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: category.accent, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{category.name}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {category.skills.map((skill) => (
                <SkillPill key={skill.name} name={skill.name} accent={category.accent} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
