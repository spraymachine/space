import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BasePlanet from './BasePlanet';

export default function Saturn({ position = [0, 0, 0], segments = 32 }) {
  const ringsRef = useRef();

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.015;
    }
  });

  return (
    <BasePlanet
      position={position}
      radius={1.6}
      color="#D4BE8E"
      emissive="#8B7355"
      emissiveIntensity={0.06}
      atmosphereColor="#EAD6A6"
      atmosphereScale={1.1}
      rotationSpeed={0.1}
      segments={segments}
      surfaceDetail={{ color: '#C4A96A', opacity: 0.15 }}
      rimColor="#EAD6A6"
      rimIntensity={0.25}
      axialTilt={0.47}
    >
      {/* Ring system — 5 concentric rings with varying opacity for depth */}
      <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Inner gap (Cassini Division feel) */}
        <mesh>
          <ringGeometry args={[1.9, 2.2, 128]} />
          <meshBasicMaterial
            color="#EAD6A6"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Main bright ring (B ring) */}
        <mesh>
          <ringGeometry args={[2.2, 2.7, 128]} />
          <meshBasicMaterial
            color="#D4BE8E"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Gap */}
        <mesh>
          <ringGeometry args={[2.7, 2.8, 128]} />
          <meshBasicMaterial
            color="#C4A96A"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* A ring */}
        <mesh>
          <ringGeometry args={[2.8, 3.3, 128]} />
          <meshBasicMaterial
            color="#EAD6A6"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Faint outer ring (F ring) */}
        <mesh>
          <ringGeometry args={[3.4, 3.7, 128]} />
          <meshBasicMaterial
            color="#C4A96A"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </BasePlanet>
  );
}
