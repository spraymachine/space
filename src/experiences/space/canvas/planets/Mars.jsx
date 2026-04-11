import BasePlanet from './BasePlanet';

export default function Mars({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet position={position} radius={0.9} color="#C1440E" emissive="#8B2500" emissiveIntensity={0.05} atmosphereColor="#E07040" atmosphereScale={1.08} rotationSpeed={0.07} segments={segments} />
  );
}
