import BasePlanet from './BasePlanet';
import * as THREE from 'three';

export default function Jupiter({ position = [0, 0, 0], segments = 32 }) {
  const seg = Math.max(segments, 32);

  return (
    <BasePlanet
      position={position}
      radius={2.0}
      color="#C88B3A"
      emissive="#6B4B14"
      emissiveIntensity={0.08}
      atmosphereColor="#DAA520"
      atmosphereScale={1.08}
      rotationSpeed={0.12}
      segments={segments}
      surfaceDetail={{ color: '#A0703C', opacity: 0.2 }}
      rimColor="#FFD700"
      rimIntensity={0.18}
    >
      {/* Atmospheric bands — multiple torus rings at slight offsets */}
      {[
        { y: 0.6, color: '#D4A44C', opacity: 0.2, r: 1.92 },
        { y: 0.2, color: '#8B6914', opacity: 0.25, r: 1.98 },
        { y: -0.3, color: '#B8860B', opacity: 0.2, r: 1.96 },
        { y: -0.8, color: '#CD853F', opacity: 0.15, r: 1.90 },
        { y: 1.0, color: '#DAA520', opacity: 0.12, r: 1.85 },
      ].map((band, i) => (
        <mesh key={i} position={[0, band.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[band.r, 0.06, 6, seg]} />
          <meshStandardMaterial
            color={band.color}
            transparent
            opacity={band.opacity}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Great Red Spot hint */}
      <mesh position={[1.5, -0.4, 1.1]} rotation={[0, 0.5, 0]}>
        <sphereGeometry args={[0.35, seg, seg]} />
        <meshBasicMaterial color="#C1440E" transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </BasePlanet>
  );
}
