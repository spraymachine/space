import BasePlanet from './BasePlanet';

export default function Earth({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.2}
      color="#1A5276"
      emissive="#0E3D5C"
      emissiveIntensity={0.15}
      atmosphereColor="#5DADE2"
      atmosphereScale={1.14}
      rotationSpeed={0.08}
      segments={segments}
      surfaceDetail={{ color: '#1E8449', opacity: 0.35 }}
      rimColor="#87CEEB"
      rimIntensity={0.35}
    >
      {/* Ocean specular highlight layer */}
      <mesh rotation={[0.15, 0.8, 0.05]}>
        <sphereGeometry args={[1.202, Math.max(segments, 32), Math.max(segments, 32)]} />
        <meshStandardMaterial
          color="#2E86C1"
          transparent
          opacity={0.2}
          roughness={0.3}
          metalness={0.4}
          depthWrite={false}
        />
      </mesh>
      {/* Cloud layer */}
      <mesh rotation={[0.4, 1.2, 0]}>
        <sphereGeometry args={[1.22, Math.max(segments, 32), Math.max(segments, 32)]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </BasePlanet>
  );
}
