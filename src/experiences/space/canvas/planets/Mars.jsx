import BasePlanet from './BasePlanet';

export default function Mars({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={0.9}
      color="#B7410E"
      emissive="#6B2506"
      emissiveIntensity={0.08}
      atmosphereColor="#E07040"
      atmosphereScale={1.1}
      rotationSpeed={0.07}
      segments={segments}
      surfaceDetail={{ color: '#8B4513', opacity: 0.25 }}
      rimColor="#FF6B35"
      rimIntensity={0.2}
    >
      {/* Polar ice cap highlight */}
      <mesh rotation={[0.1, 0, 0]} position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.4, Math.max(segments, 32), Math.max(segments, 32), 0, Math.PI * 2, 0, 0.5]} />
        <meshBasicMaterial color="#D4C4A8" transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </BasePlanet>
  );
}
