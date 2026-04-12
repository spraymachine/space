/**
 * SunGlow — invisible light source that illuminates planets with warm golden light.
 * No visible mesh — the "sun" is felt through its lighting, not seen directly.
 * This avoids GPU-dependent rendering artifacts from large additive-blended spheres.
 */
export default function SunGlow({ position = [30, 15, 80] }) {
  return (
    <group position={position}>
      <pointLight color="#FFD700" intensity={30} distance={250} decay={2} />
      <pointLight color="#FFA500" intensity={10} distance={400} decay={2} />
    </group>
  );
}
