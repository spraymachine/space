import BasePlanet from './BasePlanet';

export default function Uranus({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.1}
      color="#5DADE2"
      emissive="#2E86C1"
      emissiveIntensity={0.08}
      atmosphereColor="#73C2BE"
      atmosphereScale={1.12}
      rotationSpeed={0.06}
      segments={segments}
      axialTilt={1.71}
      surfaceDetail={{ color: '#48C9B0', opacity: 0.15 }}
      rimColor="#76D7C4"
      rimIntensity={0.3}
    />
  );
}
