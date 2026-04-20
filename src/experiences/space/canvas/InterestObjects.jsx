import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
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

  const baseScale = (mobile ? 1.2 : 0.9) * (interest.scaleMultiplier ?? 1);
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
