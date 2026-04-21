import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { testimonials } from '../data/testimonials';
import { PLANET_POSITIONS } from './constants';

/**
 * UranusTestimonialOrbit — testimonial cards as 3D entities parented to Uranus.
 *
 * A group anchored at Uranus's world position rotates continuously around the Y axis.
 * Each child slot holds an <Html> card at a fixed orbit radius. The cards stay
 * "billboard" (readable to camera) because Html defaults to face-camera rendering,
 * but their world positions revolve with the group — they are genuinely attached
 * to Uranus in 3D space. As the camera travels past, they recede and fade.
 *
 * Click any card (or the pause chip wired from SpaceExperience) to freeze rotation.
 */

// Responsive geometry — derived from viewport at runtime (see useEffect below)
// Desktop: radius 2.4, Mobile: radius 1.8
const CARD_Y_OFFSET = 0.35;
const TILT_X = -0.18;
const ROTATION_SPEED = 0.26;
const ZONE_START = 0.60;
const ZONE_END   = 0.86;

function getResponsiveConfig(vw) {
  if (vw <= 480) {
    // Small phones
    return { orbitRadius: 1.7, cardWidth: '188px', distanceFactor: 7, depthMin: 0.8, depthRange: 5.0 };
  } else if (vw <= 768) {
    // Mobile
    return { orbitRadius: 1.9, cardWidth: '210px', distanceFactor: 6.5, depthMin: 1.0, depthRange: 5.2 };
  } else if (vw <= 1280) {
    // Tablet / small desktop
    return { orbitRadius: 2.3, cardWidth: '240px', distanceFactor: 6, depthMin: 1.2, depthRange: 5.5 };
  } else {
    // Large desktop
    return { orbitRadius: 2.5, cardWidth: '255px', distanceFactor: 5.5, depthMin: 1.3, depthRange: 5.8 };
  }
}

// One accent per card — drawn from the planet palette so the color language
// is already established across the site.
const CARD_ACCENTS = [
  { hex: '#73C2BE', rgb: '115,194,190' },   // Uranus teal   — home planet
  { hex: '#EAD6A6', rgb: '234,214,166' },   // Saturn gold   — warm, human
  { hex: '#8BAEE8', rgb: '139,174,232' },   // Neptune blue  — technical
];

const tmpVec  = new THREE.Vector3();
const tmpVec2 = new THREE.Vector3(); // reusable — Uranus world pos

export default function UranusTestimonialOrbit({
  scrollProgressRef,
  isPaused,
  onTogglePause,
}) {
  const groupRef = useRef();
  const slotRefs = useRef([]);
  const cardDomRefs = useRef([]);
  const uranus = PLANET_POSITIONS.uranus;

  // Responsive config — re-computed on resize
  const [cfg, setCfg] = useState(() => getResponsiveConfig(window.innerWidth));
  useEffect(() => {
    const onResize = () => setCfg(getResponsiveConfig(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Create a portal target OUTSIDE the canvas's stacking context, so cards
  // render above the DOM scroll container (#space-scroll-container is z-index 2).
  const portalRef = useRef(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-uranus-testimonials-portal', '');
    el.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;';
    document.body.appendChild(el);
    portalRef.current = el;
    setPortalReady(true);
    return () => {
      document.body.removeChild(el);
      portalRef.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Auto rotation (unless paused)
    if (!isPaused) {
      groupRef.current.rotation.y += ROTATION_SPEED * delta;
    }

    // Section-level fade based on scroll proximity to Uranus waypoint
    const progress = scrollProgressRef.current ?? 0;
    let sectionFade = 0;
    if (progress >= ZONE_START && progress <= ZONE_END) {
      const p = (progress - ZONE_START) / (ZONE_END - ZONE_START);
      if (p < 0.15) sectionFade = p / 0.15;
      else if (p > 0.85) sectionFade = Math.max(0, (1 - p) / 0.15);
      else sectionFade = 1;
    }

    // Per-card visibility: hemisphere test + depth fade.
    //
    // Dot product of (Uranus→card) · (Uranus→camera) tells us which side the
    // card is on.  cosAngle > 0 → camera-facing hemisphere, < 0 → behind.
    // With 3 cards at 120° apart, exactly 1 is in the front hemisphere at any
    // time; the other two (at ±120°, cos = −0.5) are behind and hidden.
    // A ±0.15 cosine blend zone (~17°) smooths the edge of visibility.
    const camPos = state.camera.position;
    const { depthMin, depthRange } = cfg;

    // Uranus world position (constant, but read per-frame for correctness)
    tmpVec2.set(uranus[0], uranus[1], uranus[2]);
    const camToUranusLen = tmpVec2.distanceTo(camPos); // ≈ distance camera→Uranus

    for (let i = 0; i < slotRefs.current.length; i++) {
      const slot = slotRefs.current[i];
      const dom = cardDomRefs.current[i];
      if (!slot || !dom) continue;

      slot.getWorldPosition(tmpVec); // card world position

      // --- Hemisphere fade ---
      // Vectors from Uranus to card and from Uranus to camera (unnormalised)
      const ux = tmpVec.x  - uranus[0];
      const uy = tmpVec.y  - uranus[1];
      const uz = tmpVec.z  - uranus[2];
      const cx = camPos.x  - uranus[0];
      const cy = camPos.y  - uranus[1];
      const cz = camPos.z  - uranus[2];
      const dot = ux * cx + uy * cy + uz * cz;
      const cardLen = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1;
      const cosAngle = dot / (cardLen * camToUranusLen); // −1 (back) … +1 (front)

      // Smooth step across the ±0.15 blend zone around the equator
      let hemiFade;
      if (cosAngle >= 0.15)       hemiFade = 1;
      else if (cosAngle <= -0.15) hemiFade = 0;
      else                        hemiFade = (cosAngle + 0.15) / 0.30;

      // --- Depth fade (distance from camera, for front-hemisphere cards) ---
      const dist = tmpVec.distanceTo(camPos);
      const t = Math.max(0, Math.min(1, (dist - depthMin) / depthRange));
      const depthFade = 1 - t * 0.55; // front≈1.0, side≈0.7 — gentler roll-off

      const finalOpacity = sectionFade * hemiFade * depthFade;
      dom.style.opacity = String(finalOpacity);
      dom.style.pointerEvents = finalOpacity > 0.3 ? 'auto' : 'none';
    }
  });

  const { orbitRadius, cardWidth, distanceFactor } = cfg;

  return (
    <group position={uranus}>
      {/* Orbital ring stroke */}
      <mesh rotation={[Math.PI / 2 + TILT_X, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.025, orbitRadius + 0.025, 96]} />
        <meshBasicMaterial
          color="#73C2BE"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating orbit group — cards live here */}
      <group ref={groupRef} rotation={[TILT_X, 0, 0]}>
        {portalReady && testimonials.map((t, i) => {
          const angle = (i / testimonials.length) * Math.PI * 2;
          const x = Math.sin(angle) * orbitRadius;
          const z = Math.cos(angle) * orbitRadius;
          const num = String(i + 1).padStart(2, '0');
          const total = String(testimonials.length).padStart(2, '0');
          const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
          const { hex, rgb } = accent;

          return (
            <group
              key={t.id}
              ref={(el) => (slotRefs.current[i] = el)}
              position={[x, CARD_Y_OFFSET, z]}
            >
              <Html
                center
                distanceFactor={distanceFactor}
                zIndexRange={[40, 0]}
                portal={portalRef}
                style={{
                  width: cardWidth,
                  transition: 'opacity 0.25s ease-out',
                  pointerEvents: 'auto',
                }}
              >
                <div
                  ref={(el) => (cardDomRefs.current[i] = el)}
                  onClick={(e) => { e.stopPropagation(); onTogglePause?.(); }}
                  role="button"
                  tabIndex={0}
                  aria-label={isPaused ? 'Resume orbit' : 'Pause orbit'}
                  style={{ opacity: 0, cursor: 'pointer', transition: 'opacity 0.25s ease-out', userSelect: 'none' }}
                >
                  {/* Outer bezel — tinted with card accent */}
                  <div
                    style={{
                      background: `rgba(${rgb},0.10)`,
                      border: `1px solid rgba(${rgb},0.50)`,
                      borderRadius: '22px',
                      padding: '3px',
                      boxShadow: `0 24px 64px rgba(0,0,0,0.7), 0 0 48px rgba(${rgb},0.22), 0 0 0 1px rgba(${rgb},0.08) inset`,
                    }}
                  >
                    {/* Inner core */}
                    <div
                      style={{
                        position: 'relative',
                        background: `linear-gradient(145deg, rgba(8,16,20,0.97) 0%, rgba(4,10,14,0.99) 100%)`,
                        borderRadius: '19px',
                        padding: '1.25rem 1.15rem 1.1rem',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Per-card accent wash — top-right glow */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '-40%',
                          right: '-20%',
                          width: '75%',
                          height: '75%',
                          background: `radial-gradient(circle at 35% 35%, rgba(${rgb},0.38), transparent 62%)`,
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Bottom-left faint wash for depth */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          bottom: '-20%',
                          left: '-10%',
                          width: '50%',
                          height: '50%',
                          background: `radial-gradient(circle, rgba(${rgb},0.10), transparent 65%)`,
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Meta row: counter + quote mark */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.5rem',
                            letterSpacing: '0.22em',
                            color: hex,
                            opacity: 0.9,
                            textTransform: 'uppercase',
                          }}
                        >
                          {num} / {total}
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2.4rem',
                            lineHeight: 0.5,
                            color: hex,
                            opacity: 0.55,
                            marginTop: '0.3rem',
                          }}
                        >
                          &ldquo;
                        </span>
                      </div>

                      {/* Quote — maximum legibility */}
                      <p
                        style={{
                          position: 'relative',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          lineHeight: 1.62,
                          color: 'rgba(232,244,248,0.92)',
                          letterSpacing: '-0.005em',
                          margin: 0,
                        }}
                      >
                        {t.quote}
                      </p>

                      {/* Divider — accent-colored gradient */}
                      <div
                        style={{
                          height: '1px',
                          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.6), transparent)`,
                        }}
                      />

                      {/* Author row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          position: 'relative',
                        }}
                      >
                        {/* Initials circle */}
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: `rgba(${rgb},0.18)`,
                            border: `1px solid rgba(${rgb},0.65)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 0 18px rgba(${rgb},0.35)`,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.5rem',
                              fontWeight: 700,
                              color: hex,
                              letterSpacing: '0.05em',
                            }}
                          >
                            {t.initials}
                          </span>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: 'var(--star-white)',
                              lineHeight: 1.2,
                              margin: 0,
                            }}
                          >
                            {t.name}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.46rem',
                              letterSpacing: '0.14em',
                              color: hex,
                              opacity: 0.8,
                              textTransform: 'uppercase',
                              marginTop: '0.2rem',
                            }}
                          >
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
