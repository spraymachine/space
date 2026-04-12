import BasePlanet from './BasePlanet';

export default function Neptune({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.0}
      color="#2E4057"
      emissive="#1B2838"
      emissiveIntensity={0.12}
      atmosphereColor="#3D5FC4"
      atmosphereScale={1.12}
      rotationSpeed={0.09}
      segments={segments}
      surfaceDetail={{ color: '#5B7FFF', opacity: 0.2 }}
      rimColor="#6C8CFF"
      rimIntensity={0.35}
    >
      {/* Storm band hints */}
      <mesh rotation={[0.1, 0, 0]} position={[0, 0.3, 0]}>
        <torusGeometry args={[0.98, 0.03, 6, 64]} />
        <meshBasicMaterial color="#4169E1" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </BasePlanet>
  );
}
