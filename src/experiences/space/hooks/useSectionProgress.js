import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Measures where each DOM section sits in the overall scroll range
 * and computes the scroll progress value at each section's center.
 * This is used to dynamically generate CameraRig waypoints so the
 * 3D camera always matches the visible DOM content.
 *
 * Returns a ref containing { sectionId: progressAtCenter } mapping.
 * Updates on resize and after ScrollTrigger refresh (to account for pins).
 */
const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'testimonials', 'contact'];

export function useSectionProgress() {
  const progressMapRef = useRef({});

  const measure = useCallback(() => {
    // Must wait for ScrollTrigger to finish its layout (pins change scroll height)
    const container = document.getElementById('space-scroll-container');
    if (!container) return;

    const scrollHeight = container.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollable = scrollHeight - viewportHeight;
    if (scrollable <= 0) return;

    const map = {};

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      // For pinned sections, use the pin's scroll range from ScrollTrigger
      const triggers = ScrollTrigger.getAll();
      const pinTrigger = triggers.find(
        (t) => t.pin === el && t.vars.pin === true
      );

      if (pinTrigger) {
        // Pinned section: use the pin's scroll start/end
        const pinStart = pinTrigger.start;
        const pinEnd = pinTrigger.end;
        map[id] = {
          start: pinStart / scrollable,
          center: ((pinStart + pinEnd) / 2) / scrollable,
          end: pinEnd / scrollable,
        };
      } else {
        // Normal section: measure offsetTop relative to the document
        // Account for the fact that elements may be pushed down by pins
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;
        const height = el.offsetHeight;

        const startProgress = Math.max(0, (absoluteTop - viewportHeight) / scrollable);
        const centerProgress = Math.max(0, (absoluteTop + height / 2 - viewportHeight / 2) / scrollable);
        const endProgress = Math.min(1, (absoluteTop + height) / scrollable);

        map[id] = {
          start: startProgress,
          center: centerProgress,
          end: endProgress,
        };
      }
    });

    progressMapRef.current = map;
  }, []);

  useEffect(() => {
    // ScrollTrigger needs a moment to set up pins and compute scroll heights.
    // Use ScrollTrigger.addEventListener to run after refresh.
    const onRefresh = () => {
      measure();
    };

    // Initial measurement after a short delay (pins need to initialize)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      measure();
    }, 500);

    ScrollTrigger.addEventListener('refresh', onRefresh);
    window.addEventListener('resize', measure);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return progressMapRef;
}
