import BasePlanet from './BasePlanet';

export default function Uranus({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet position={position} radius={1.1} color="#73C2BE" emissive="#4A9994" emissiveIntensity={0.05} atmosphereColor="#73C2BE" atmosphereScale={1.1} rotationSpeed={0.06} segments={segments} axialTilt={1.71} />
  );
}
