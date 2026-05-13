import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useKTX2GLTF } from './useKTX2GLTF';

export default function Mars({ position = [0, 0, 0] }) {
  const { scene } = useKTX2GLTF('/3d-models/24881_Mars_1_6792-compressed.glb');
  const groupRef = useRef();

  const scale = useMemo(() => {
    try {
      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(scene);
      if (box.isEmpty()) return 1;
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      return maxDim > 0 ? 1.8 / maxDim : 1;
    } catch {
      return 1;
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.07;
  });

  return (
    <group ref={groupRef} position={position}>
      <Clone object={scene} scale={scale} />
    </group>
  );
}
