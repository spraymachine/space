import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Starfield from './Starfield';
import SunGlow from './effects/SunGlow';
import CameraRig from './CameraRig';
import Earth from './planets/Earth';
import Mars from './planets/Mars';
import Jupiter from './planets/Jupiter';
import Saturn from './planets/Saturn';
import Uranus from './planets/Uranus';
import Neptune from './planets/Neptune';

export { PLANET_POSITIONS } from './constants';
import { PLANET_POSITIONS } from './constants';

export default function SpaceCanvas({ gpuTier, scrollProgressRef, orbitAngleRef, isOrbiting }) {
  const seg = gpuTier.planetDetail;

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 500 }}
      dpr={gpuTier.dpr}
      frameloop="always"
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
      gl={{
        antialias: gpuTier.tier !== 'low',
        powerPreference: 'high-performance',
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Starfield count={gpuTier.starCount} />
        <SunGlow position={[30, 15, 80]} />

        <Earth position={PLANET_POSITIONS.earth} segments={seg} />
        <Mars position={PLANET_POSITIONS.mars} segments={seg} />
        <Jupiter position={PLANET_POSITIONS.jupiter} segments={seg} />
        <Saturn position={PLANET_POSITIONS.saturn} segments={seg} />
        <Uranus position={PLANET_POSITIONS.uranus} segments={seg} />
        <Neptune position={PLANET_POSITIONS.neptune} segments={seg} />

        <CameraRig
          scrollProgressRef={scrollProgressRef}
          orbitAngleRef={orbitAngleRef}
          isOrbiting={isOrbiting}
        />
      </Suspense>
    </Canvas>
  );
}
