import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Enhanced BasePlanet with:
 * - Fresnel rim glow (bright edge, dark center like a real planet lit from behind)
 * - Multiple atmosphere layers for depth
 * - Surface variation via a second overlay sphere with noise-like offset
 * - Minimum 32 segments for roundness
 */
export default function BasePlanet({
  position = [0, 0, 0],
  radius = 1,
  color = '#ffffff',
  emissive = '#000000',
  emissiveIntensity = 0,
  atmosphereColor = null,
  atmosphereScale = 1.15,
  rotationSpeed = 0.1,
  segments = 32,
  axialTilt = 0,
  surfaceDetail = null, // { color, opacity } for a second surface layer
  rimColor = null, // override rim glow color (defaults to atmosphereColor)
  rimIntensity = 0.2,
  children,
}) {
  const meshRef = useRef();
  const rimRef = useRef();
  const seg = Math.max(segments, 32);

  // Fresnel shader material for rim glow
  const rimMaterial = useMemo(() => {
    const rc = rimColor || atmosphereColor || color;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        rimColor: { value: new THREE.Color(rc) },
        rimPower: { value: 2.5 },
        rimIntensity: { value: rimIntensity },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 rimColor;
        uniform float rimPower;
        uniform float rimIntensity;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float fresnel = 1.0 - dot(vNormal, vViewDir);
          fresnel = pow(max(fresnel, 0.0), rimPower) * rimIntensity;
          gl_FragColor = vec4(rimColor, fresnel);
        }
      `,
    });
  }, [rimColor, atmosphereColor, color, rimIntensity]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
    }
  });

  return (
    <group position={position} rotation={[0, 0, axialTilt]}>
      {/* Core planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, seg, seg]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Surface detail overlay */}
      {surfaceDetail && (
        <mesh rotation={[0.3, 0.6, 0.1]}>
          <sphereGeometry args={[radius * 1.001, seg, seg]} />
          <meshStandardMaterial
            color={surfaceDetail.color}
            transparent
            opacity={surfaceDetail.opacity || 0.3}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Fresnel rim glow — gives planets that lit-from-behind cinematic edge */}
      <mesh ref={rimRef} scale={1.01}>
        <sphereGeometry args={[radius, seg, seg]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>

      {/* Outer atmosphere haze (soft, large) */}
      {atmosphereColor && (
        <>
          <mesh scale={atmosphereScale}>
            <sphereGeometry args={[radius, seg, seg]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.06}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Inner atmosphere (tighter, brighter) */}
          <mesh scale={1.03}>
            <sphereGeometry args={[radius, seg, seg]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.04}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {children}
    </group>
  );
}
