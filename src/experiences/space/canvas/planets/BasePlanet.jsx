import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
  children,
}) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
    }
  });

  return (
    <group position={position} rotation={[0, 0, axialTilt]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.8} metalness={0.1} />
      </mesh>

      {atmosphereColor && (
        <mesh scale={atmosphereScale}>
          <sphereGeometry args={[radius, segments, segments]} />
          <meshBasicMaterial color={atmosphereColor} transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {children}
    </group>
  );
}
