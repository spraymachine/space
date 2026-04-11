import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BasePlanet from './BasePlanet';

export default function Saturn({ position = [0, 0, 0], segments = 32 }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    <BasePlanet position={position} radius={1.6} color="#EAD6A6" emissive="#C4A96A" emissiveIntensity={0.05} atmosphereColor="#EAD6A6" atmosphereScale={1.08} rotationSpeed={0.1} segments={segments} axialTilt={0.47}>
      <group ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.0, 2.4, 64]} />
          <meshBasicMaterial color="#EAD6A6" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.5, 2.9, 64]} />
          <meshBasicMaterial color="#D4BE8E" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[3.0, 3.3, 64]} />
          <meshBasicMaterial color="#C4A96A" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </BasePlanet>
  );
}
