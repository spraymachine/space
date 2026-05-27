import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useKTX2GLTF } from './useKTX2GLTF';

export default function Jupiter({ position = [0, 0, 0], mobile = false }) {
  const { scene } = useKTX2GLTF('/3d-models/Jupiter_1_142984-compressed.glb');
  const groupRef = useRef();

  const scale = useMemo(() => {
    try {
      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(scene);
      if (box.isEmpty()) return 1;
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const base = maxDim > 0 ? 4.0 / maxDim : 1;
      return base * (mobile ? 1.4 : 1);
    } catch {
      return 1;
    }
  }, [scene, mobile]);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <group ref={groupRef} position={position}>
      <Clone object={scene} scale={scale} />
    </group>
  );
}
