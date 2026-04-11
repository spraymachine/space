import { useRef, useEffect, useState, useCallback } from 'react';

const PARTICLE_COUNT = 200;
const DURATION = 3500;

export default function BigBang({ onComplete }) {
  const canvasRef = useRef();
  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const alreadyPlayed = sessionStorage.getItem('bigBangPlayed') === 'true';

  const finish = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem('bigBangPlayed', 'true');
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (alreadyPlayed) {
      finish();
      return;
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      return {
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: Math.random() > 0.3 ? '#FFFFFF' : (Math.random() > 0.5 ? '#FFD700' : '#FF6B35'),
      };
    });

    const startTime = performance.now();
    let animFrameId;

    function animate(now) {
      if (skipped) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, w(), h());

      const cx = w() / 2;
      const cy = h() / 2;

      if (progress < 0.15) {
        const pulse = 1 + Math.sin(elapsed * 0.02) * 0.3;
        const pointSize = 3 * pulse;
        ctx.beginPath();
        ctx.arc(cx, cy, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * pulse);
        glow.addColorStop(0, 'rgba(255,255,255,0.4)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      } else if (progress < 0.45) {
        const explodeProgress = (progress - 0.15) / 0.3;

        if (explodeProgress < 0.15) {
          const flashAlpha = (1 - explodeProgress / 0.15) * 0.8;
          ctx.fillStyle = `rgba(255, 248, 220, ${flashAlpha})`;
          ctx.fillRect(0, 0, w(), h());
        }

        particles.forEach((p) => {
          p.x = cx + p.vx * explodeProgress * 80;
          p.y = cy + p.vy * explodeProgress * 80;
          p.alpha = 1 - explodeProgress * 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - explodeProgress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else {
        const settleProgress = (progress - 0.45) / 0.55;

        particles.forEach((p, i) => {
          const targetX = (Math.sin(i * 137.5) * 0.5 + 0.5) * w();
          const targetY = (Math.cos(i * 137.5) * 0.5 + 0.5) * h();
          const currentX = cx + p.vx * 80;
          const currentY = cy + p.vy * 80;

          p.x = currentX + (targetX - currentX) * settleProgress;
          p.y = currentY + (targetY - currentY) * settleProgress;
          p.alpha = 1 - settleProgress;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        if (settleProgress > 0.7) {
          const fadeAlpha = (settleProgress - 0.7) / 0.3;
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
          ctx.fillRect(0, 0, w(), h());
        }
      }

      if (progress >= 1) {
        finish();
        return;
      }

      animFrameId = requestAnimationFrame(animate);
    }

    animFrameId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(skipTimer);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [alreadyPlayed, finish, skipped]);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', pointerEvents: 'auto' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {showSkip && (
        <button
          onClick={() => { setSkipped(true); finish(); }}
          className="font-mono"
          style={{
            position: 'absolute', bottom: 'clamp(1.5rem, 4vh, 2.5rem)', right: 'clamp(1.5rem, 4vw, 2.5rem)',
            background: 'transparent', border: '1px solid rgba(232,244,248,0.15)', borderRadius: '100px',
            padding: '0.4rem 1rem', color: 'rgba(232,244,248,0.5)', fontSize: '0.6rem', letterSpacing: '0.15em',
            cursor: 'pointer', zIndex: 10000, transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(232,244,248,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(232,244,248,0.15)'}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
