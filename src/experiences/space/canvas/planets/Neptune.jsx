import BasePlanet from './BasePlanet';

export default function Neptune({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet position={position} radius={1.0} color="#3D5FC4" emissive="#2A4290" emissiveIntensity={0.08} atmosphereColor="#3D5FC4" atmosphereScale={1.1} rotationSpeed={0.09} segments={segments} />
  );
}
