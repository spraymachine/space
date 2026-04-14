# Floating Interest Objects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 9 interactive floating emoji sprites scattered throughout the 3D space scroll journey, with a gamified "collect them all" discovery counter.

**Architecture:** Three.js Sprite meshes with CanvasTexture emojis live inside SpaceCanvas. DOM overlays handle the discovery counter (fixed pill) and interest detail cards (glass popup). State is lifted to SpaceExperience and persisted to localStorage.

**Tech Stack:** React 19, Three.js / @react-three/fiber, GSAP, existing glass-morphism CSS

---

### Task 1: Create the interests data file

**Files:**
- Create: `src/experiences/space/data/interests.js`

This is the single source of truth for all interest objects. Positions are calculated as midpoints between planet positions from `constants.js`, offset left/right on the X axis.

Planet positions for reference:
- earth: `[2, 0, 0]`
- mars: `[1.5, -0.5, -30]`
- jupiter: `[-2, 0.5, -65]`
- saturn: `[0, 0, -110]`
- uranus: `[2, -0.3, -150]`
- neptune: `[-1.5, 0.2, -190]`

- [ ] **Step 1: Create `src/experiences/space/data/interests.js`**

```js
export const interests = [
  {
    id: 'coffee',
    emoji: '☕',
    name: 'Coffee',
    description: 'Fueled by caffeine',
    position: [5, 1, -15],       // between Earth→Mars, right
    color: '#C88B3A',
  },
  {
    id: 'badminton',
    emoji: '🏸',
    name: 'Badminton',
    description: 'District Level, Age 16',
    position: [-3, 0.5, -40],    // between Mars→Jupiter, left
    color: '#73C2BE',
  },
  {
    id: 'roller-skating',
    emoji: '⛸️',
    name: 'Roller Skating',
    description: 'District Champ, Age 5-7',
    position: [3, -0.5, -50],    // between Mars→Jupiter, right
    color: '#B794F6',
  },
  {
    id: 'percussion',
    emoji: '🥁',
    name: 'Percussion',
    description: 'Snare, Tabla, Mridangam & more. Band Parade Lead',
    position: [-4, 1, -80],      // between Jupiter→Saturn, left
    color: '#FFD700',
  },
  {
    id: 'football',
    emoji: '⚽',
    name: 'Football',
    description: 'District Level, 2019-2020',
    position: [4, -0.5, -90],    // between Jupiter→Saturn, right
    color: '#4B9CD3',
  },
  {
    id: 'swimming',
    emoji: '🏊',
    name: 'Swimming',
    description: 'District Level, Age 12',
    position: [-3, 0, -130],     // between Saturn→Uranus, left
    color: '#73C2BE',
  },
  {
    id: 'gym',
    emoji: '🏋️',
    name: 'Gym',
    description: '195kg Deadlift',
    position: [4, 0.5, -165],    // between Uranus→Neptune, right
    color: '#C1440E',
  },
  {
    id: 'music',
    emoji: '🎧',
    name: 'Music',
    description: 'Hip-hop, RnB, Trap & Telugu. Daily listener',
    position: [-4, -0.3, -172],  // between Uranus→Neptune, left
    color: '#B794F6',
  },
  {
    id: 'reading',
    emoji: '📖',
    name: 'Reading',
    description: 'Always got a book going',
    position: [3, 0.5, -200],    // after Neptune, right
    color: '#EAD6A6',
  },
];
```

- [ ] **Step 2: Verify the file imports cleanly**

Run: `cd /Users/mani/Desktop/space && npx vite build --mode development 2>&1 | head -20`
Expected: No import errors

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/data/interests.js
git commit -m "feat: add interests data file for floating discovery objects"
```

---

### Task 2: Create InterestObjects canvas component

**Files:**
- Create: `src/experiences/space/canvas/InterestObjects.jsx`

This component renders 9 Three.js Sprites inside the canvas. Each sprite uses a CanvasTexture with the emoji rendered on it, plus a glow sprite behind it. It handles hover detection (desktop), click/tap raycasting, bob + rotation animation, and communicates discoveries to the parent via callback.

- [ ] **Step 1: Create `src/experiences/space/canvas/InterestObjects.jsx`**

```jsx
import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { interests } from '../data/interests';

const MOBILE_BREAKPOINT = 768;

// Generate a canvas texture with an emoji + optional glow
function createEmojiTexture(emoji, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${size * 0.65}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createGlowTexture(color, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, color + 'AA');
  gradient.addColorStop(0.4, color + '44');
  gradient.addColorStop(1, color + '00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function InterestSprite({ interest, discovered, onDiscover, onHover, hovered, gpuTier }) {
  const spriteRef = useRef();
  const glowRef = useRef();
  const mobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

  const emojiTexture = useMemo(() => createEmojiTexture(interest.emoji), [interest.emoji]);
  const glowTexture = useMemo(
    () => createGlowTexture(discovered ? interest.color : '#FFD700'),
    [interest.color, discovered]
  );

  const baseScale = mobile ? 1.2 : 0.9;
  const bobAmplitude = mobile ? 0.15 : 0.3;

  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    const t = clock.getElapsedTime();

    // Bob animation
    const offset = interest.id.length * 0.7; // unique phase per object
    spriteRef.current.position.y = interest.position[1] + Math.sin(t * 0.8 + offset) * bobAmplitude;

    // Scale pulse on hover
    const targetScale = hovered ? baseScale * 1.2 : baseScale;
    const current = spriteRef.current.scale.x;
    const newScale = current + (targetScale - current) * 0.1;
    spriteRef.current.scale.set(newScale, newScale, 1);

    // Glow follows sprite
    if (glowRef.current) {
      glowRef.current.position.y = spriteRef.current.position.y;
      const glowScale = newScale * (hovered ? 2.8 : 2.2);
      const glowOpacity = discovered ? 0.15 : (hovered ? 0.5 : 0.3);
      glowRef.current.scale.set(glowScale, glowScale, 1);
      glowRef.current.material.opacity = glowRef.current.material.opacity +
        (glowOpacity - glowRef.current.material.opacity) * 0.1;
    }
  });

  const showGlow = gpuTier !== 'low';

  return (
    <group>
      {/* Glow aura behind emoji */}
      {showGlow && (
        <sprite
          ref={glowRef}
          position={interest.position}
          scale={[baseScale * 2.2, baseScale * 2.2, 1]}
        >
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={discovered ? 0.15 : 0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Emoji sprite */}
      <sprite
        ref={spriteRef}
        position={interest.position}
        scale={[baseScale, baseScale, 1]}
        onClick={(e) => {
          e.stopPropagation();
          onDiscover(interest.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!mobile) {
            onHover(interest.id);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (!mobile) {
            onHover(null);
            document.body.style.cursor = 'default';
          }
        }}
      >
        <spriteMaterial
          map={emojiTexture}
          transparent
          opacity={discovered ? 0.5 : 1}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

export default function InterestObjects({ discoveredIds, onDiscover, gpuTier }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Enable pointer events on the canvas when this component mounts
  const { gl } = useThree();
  useMemo(() => {
    gl.domElement.style.pointerEvents = 'auto';
  }, [gl]);

  return (
    <group>
      {interests.map((interest) => (
        <InterestSprite
          key={interest.id}
          interest={interest}
          discovered={discoveredIds.includes(interest.id)}
          onDiscover={onDiscover}
          onHover={setHoveredId}
          hovered={hoveredId === interest.id}
          gpuTier={gpuTier}
        />
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/experiences/space/canvas/InterestObjects.jsx
git commit -m "feat: add InterestObjects canvas component with emoji sprites"
```

---

### Task 3: Create DiscoveryCounter DOM component

**Files:**
- Create: `src/experiences/space/components/DiscoveryCounter.jsx`

Fixed-position glass pill showing "✦ X / Y". Pulses gold when a new discovery is made. Hidden during Big Bang intro.

- [ ] **Step 1: Create `src/experiences/space/components/DiscoveryCounter.jsx`**

```jsx
import { useState, useEffect, useRef } from 'react';
import { interests } from '../data/interests';

export default function DiscoveryCounter({ discoveredCount, visible }) {
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(discoveredCount);
  const total = interests.length;
  const allFound = discoveredCount === total;

  useEffect(() => {
    if (discoveredCount > prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 800);
      prevCount.current = discoveredCount;
      return () => clearTimeout(timer);
    }
  }, [discoveredCount]);

  if (!visible) return null;

  return (
    <div
      className="font-mono"
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 3vh, 2rem)',
        right: 'clamp(1rem, 3vw, 2rem)',
        zIndex: 50,
        background: pulse || allFound
          ? 'rgba(255, 215, 0, 0.12)'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${
          pulse || allFound
            ? 'rgba(255, 215, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '20px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        transition: 'all 0.4s ease',
        boxShadow: pulse || allFound
          ? '0 0 20px rgba(255, 215, 0, 0.15)'
          : 'none',
        animation: 'fadeIn 0.5s ease-out',
        pointerEvents: 'none',
      }}
    >
      <span style={{
        color: '#FFD700',
        fontSize: '0.65rem',
        transition: 'transform 0.3s ease',
        transform: pulse ? 'scale(1.3)' : 'scale(1)',
        display: 'inline-block',
      }}>
        ✦
      </span>
      <span style={{
        color: pulse || allFound ? '#FFD700' : 'rgba(255, 255, 255, 0.6)',
        fontWeight: pulse || allFound ? 600 : 400,
        transition: 'color 0.4s ease, font-weight 0.4s ease',
      }}>
        {discoveredCount} / {total}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/experiences/space/components/DiscoveryCounter.jsx
git commit -m "feat: add DiscoveryCounter glass pill component"
```

---

### Task 4: Create InterestCard DOM component

**Files:**
- Create: `src/experiences/space/components/InterestCard.jsx`

Glass card popup that shows when an interest is discovered/clicked. Centered on desktop, bottom sheet on mobile. Click-anywhere or swipe-down to dismiss.

- [ ] **Step 1: Create `src/experiences/space/components/InterestCard.jsx`**

```jsx
import { useCallback, useRef } from 'react';

export default function InterestCard({ interest, onDismiss }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const touchStartY = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80) onDismiss();
    touchStartY.current = null;
  }, [onDismiss]);

  if (!interest) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 60,
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Card */}
      <div
        className="interest-detail-card"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        style={{
          position: 'fixed',
          zIndex: 65,
          ...(isMobile
            ? {
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '20px 20px 0 0',
                animation: 'slideUpInterest 0.4s ease-out',
              }
            : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '16px',
                animation: 'popIn 0.3s ease-out',
              }),
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: isMobile ? '1.5rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom))' : '2rem',
          textAlign: 'center',
          maxWidth: isMobile ? '100%' : '320px',
          width: isMobile ? '100%' : 'auto',
          minWidth: isMobile ? 'auto' : '280px',
        }}
      >
        {/* Mobile swipe handle */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.2)',
            }} />
          </div>
        )}

        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
          {interest.emoji}
        </div>

        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: interest.color || '#FFD700',
            marginBottom: '0.5rem',
          }}
        >
          DISCOVERED
        </p>

        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--star-white)',
          marginBottom: '0.5rem',
        }}>
          {interest.name}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: 'var(--text-dim)',
        }}>
          {interest.description}
        </p>

        <p style={{
          marginTop: '1.25rem',
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.2)',
        }}>
          {isMobile ? 'swipe down to dismiss' : 'click anywhere to dismiss'}
        </p>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/experiences/space/components/InterestCard.jsx
git commit -m "feat: add InterestCard glass popup component"
```

---

### Task 5: Add CSS keyframes for InterestCard animations

**Files:**
- Modify: `src/styles/globals.css`

Add the two new keyframe animations used by InterestCard — `slideUpInterest` for mobile bottom sheet and `popIn` for desktop centered card.

- [ ] **Step 1: Add keyframes to `src/styles/globals.css`**

Add after the existing `@keyframes slideInRight` block (after line 91):

```css
@keyframes slideUpInterest {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

- [ ] **Step 2: Add mobile responsive rule for the interest card**

Add inside the `@media (max-width: 768px)` block, after the `.project-detail-panel` rules (after line 152):

```css
  /* Interest card — bottom sheet on mobile */
  .interest-detail-card {
    max-height: 60vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
```

- [ ] **Step 3: Add mobile responsive rule for the discovery counter position**

Add inside the same `@media (max-width: 768px)` block:

```css
  /* Discovery counter — move to top-right on mobile to avoid thumb zone */
  .discovery-counter-mobile {
    bottom: auto !important;
    top: clamp(0.75rem, 2vh, 1.5rem) !important;
    right: clamp(0.75rem, 2vw, 1.5rem) !important;
  }
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: add keyframes and mobile styles for interest discovery UI"
```

---

### Task 6: Wire everything into SpaceCanvas and SpaceExperience

**Files:**
- Modify: `src/experiences/space/canvas/SpaceCanvas.jsx`
- Modify: `src/experiences/space/SpaceExperience.jsx`

This task connects all the pieces: adds InterestObjects to the 3D canvas, adds discovery state with localStorage persistence to SpaceExperience, and renders the counter + card overlays.

- [ ] **Step 1: Modify `src/experiences/space/canvas/SpaceCanvas.jsx`**

Add import at the top (after line 11):

```js
import InterestObjects from './InterestObjects';
```

Add `discoveredIds`, `onDiscover`, and `gpuTier` to the component props. Change the function signature from:

```js
export default function SpaceCanvas({ gpuTier, scrollProgressRef, orbitAngleRef, isOrbiting }) {
```

to:

```js
export default function SpaceCanvas({ gpuTier, scrollProgressRef, orbitAngleRef, isOrbiting, discoveredIds, onDiscover }) {
```

Add `<InterestObjects />` inside the `<Suspense>` block, after the Neptune planet and before `<CameraRig>`:

```jsx
        <InterestObjects
          discoveredIds={discoveredIds}
          onDiscover={onDiscover}
          gpuTier={gpuTier.tier}
        />
```

Also, the Canvas currently has `pointerEvents: 'none'`. The InterestObjects component sets `pointerEvents: 'auto'` on the gl.domElement internally, so the sprites can receive clicks. No change needed to the Canvas style — the component handles this.

- [ ] **Step 2: Modify `src/experiences/space/SpaceExperience.jsx`**

Add imports at the top (after the existing imports, around line 13):

```js
import DiscoveryCounter from './components/DiscoveryCounter';
import InterestCard from './components/InterestCard';
import { interests } from './data/interests';
```

Add discovery state inside the component function, after the `isOrbiting` state (after line 28):

```js
  // Discovery state — persisted to localStorage
  const [discoveredIds, setDiscoveredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('space-discovered-interests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeInterest, setActiveInterest] = useState(null);

  const handleDiscover = useCallback((id) => {
    const interest = interests.find((i) => i.id === id);
    if (!interest) return;
    setActiveInterest(interest);
    setDiscoveredIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem('space-discovered-interests', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
```

Also add `useCallback` to the import on line 1:

```js
import { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react';
```

Pass the new props to `<SpaceCanvas>`:

```jsx
        <SpaceCanvas
          gpuTier={gpuTier}
          scrollProgressRef={scrollProgressRef}
          orbitAngleRef={orbitAngleRef}
          isOrbiting={isOrbiting}
          discoveredIds={discoveredIds}
          onDiscover={handleDiscover}
        />
```

Add the DOM overlays inside the main `<div>`, after the `</Suspense>` closing tag for SpaceCanvas and before the scroll container `<div>` (between lines 108 and 111):

```jsx
      {/* Discovery counter */}
      <DiscoveryCounter
        discoveredCount={discoveredIds.length}
        visible={introComplete}
      />

      {/* Interest detail card */}
      {activeInterest && (
        <InterestCard
          interest={activeInterest}
          onDismiss={() => setActiveInterest(null)}
        />
      )}
```

- [ ] **Step 3: Verify the app builds**

Run: `cd /Users/mani/Desktop/space && npx vite build 2>&1 | tail -10`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add src/experiences/space/canvas/SpaceCanvas.jsx src/experiences/space/SpaceExperience.jsx
git commit -m "feat: wire up interest discovery system — sprites, counter, and cards"
```

---

### Task 7: Add mobile class to DiscoveryCounter

**Files:**
- Modify: `src/experiences/space/components/DiscoveryCounter.jsx`

Add the `discovery-counter-mobile` CSS class so the mobile media query repositions it to top-right.

- [ ] **Step 1: Update the counter's outer div**

In `src/experiences/space/components/DiscoveryCounter.jsx`, change the outer `<div>` to include the class name. Change:

```jsx
      className="font-mono"
```

to:

```jsx
      className="font-mono discovery-counter-mobile"
```

- [ ] **Step 2: Commit**

```bash
git add src/experiences/space/components/DiscoveryCounter.jsx
git commit -m "fix: add mobile class for discovery counter repositioning"
```

---

### Task 8: Manual testing and position tuning

**Files:** No new files — this is a verification and tuning pass.

- [ ] **Step 1: Start the dev server**

Run: `cd /Users/mani/Desktop/space && npm run dev`

- [ ] **Step 2: Test desktop flow**

Open the site in a browser. Scroll through the full journey and verify:
- All 9 emoji sprites are visible, floating with bob animation
- Hovering a sprite shows scale-up and pointer cursor
- Clicking a sprite opens the InterestCard with correct content
- Discovery counter increments and pulses on new discovery
- Clicking anywhere dismisses the card
- Already-discovered sprites appear dimmer but are still clickable
- Counter persists after page reload (check localStorage)

- [ ] **Step 3: Test mobile flow**

Use browser DevTools responsive mode (iPhone 14 / 390px width). Verify:
- Sprites are slightly larger and visible near center
- Tapping a sprite opens the bottom sheet card
- Swipe down dismisses the card
- Counter is positioned top-right
- No scroll conflicts with Lenis

- [ ] **Step 4: Tune positions if needed**

If any sprites overlap with planets or are hard to spot, adjust the `position` arrays in `src/experiences/space/data/interests.js`. The X coordinate controls left/right offset, Y controls height, Z controls depth along the scroll path.

- [ ] **Step 5: Final commit if any positions were adjusted**

```bash
git add src/experiences/space/data/interests.js
git commit -m "fix: tune interest object positions for visibility"
```
