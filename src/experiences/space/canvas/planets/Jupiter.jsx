import BasePlanet from './BasePlanet';

export default function Jupiter({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet position={position} radius={2.0} color="#C88B3A" emissive="#8B6914" emissiveIntensity={0.05} atmosphereColor="#DAA520" atmosphereScale={1.06} rotationSpeed={0.12} segments={segments}>
      <mesh>
        <torusGeometry args={[2.01, 0.08, 8, 64]} />
        <meshStandardMaterial color="#A0703C" transparent opacity={0.3} roughness={1} />
      </mesh>
      <mesh rotation={[0.1, 0, 0]}>
        <torusGeometry args={[2.01, 0.06, 8, 64]} />
        <meshStandardMaterial color="#B8860B" transparent opacity={0.2} roughness={1} />
      </mesh>
    </BasePlanet>
  );
}
