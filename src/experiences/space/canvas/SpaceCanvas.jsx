import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Starfield from './Starfield';

export const PLANET_POSITIONS = {
  earth:   [2, 0, 0],
  mars:    [1.5, -0.5, -30],
  jupiter: [-2, 0.5, -65],
  saturn:  [0, 0, -110],
  uranus:  [2, -0.3, -150],
  neptune: [-1.5, 0.2, -190],
};

export default function SpaceCanvas({ gpuTier, scrollProgressRef }) {
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
      </Suspense>
    </Canvas>
  );
}
