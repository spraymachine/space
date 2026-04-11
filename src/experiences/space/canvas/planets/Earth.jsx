import BasePlanet from './BasePlanet';

export default function Earth({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet position={position} radius={1.2} color="#2B6CB0" emissive="#1A365D" emissiveIntensity={0.1} atmosphereColor="#4B9CD3" atmosphereScale={1.12} rotationSpeed={0.08} segments={segments}>
      <mesh rotation={[0.2, 0, 0.1]}>
        <sphereGeometry args={[1.201, segments, segments]} />
        <meshStandardMaterial color="#2F855A" transparent opacity={0.4} roughness={0.9} />
      </mesh>
    </BasePlanet>
  );
}
