import { useRef, useEffect, useCallback } from 'react';

export function useOrbitControls(containerRef, { enabled = false, onAngleChange }) {
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const angle = useRef(0);

  const handleStart = useCallback((clientX) => {
    if (!enabled) return;
    isDragging.current = true;
    lastX.current = clientX;
  }, [enabled]);

  const handleMove = useCallback((clientX) => {
    if (!isDragging.current || !enabled) return;
    const delta = (clientX - lastX.current) * 0.005;
    angle.current += delta;
    lastX.current = clientX;
    onAngleChange?.(angle.current);
  }, [enabled, onAngleChange]);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const onMouseDown = (e) => handleStart(e.clientX);
    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchStart = (e) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e) => { e.preventDefault(); handleMove(e.touches[0].clientX); };
    const onTouchEnd = () => handleEnd();

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
  }, [containerRef, enabled, handleStart, handleMove, handleEnd]);

  return angle;
}
