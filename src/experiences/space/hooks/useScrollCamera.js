import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollCamera() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#space-scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return scrollProgressRef;
}
