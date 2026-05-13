import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useKTX2GLTF } from './useKTX2GLTF';

export default function Saturn({ position = [0, 0, 0] }) {
  const { scene } = useKTX2GLTF('/3d-models/Saturn-1-120536-fast-normal.glb');
  const groupRef = useRef();
  const ringsRef = useRef();

  const scale = useMemo(() => {
    try {
      scene.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(scene);
      if (box.isEmpty()) return 1;
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      return maxDim > 0 ? 3.2 / maxDim : 1;
    } catch {
      return 1;
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    if (ringsRef.current) ringsRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.015;
  });

  return (
    <group position={position} rotation={[0, 0, 0.47]}>
      <group ref={groupRef}>
        <Clone object={scene} scale={scale} />
      </group>
      <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[1.9, 2.2, 128]} />
          <meshBasicMaterial color="#EAD6A6" transparent opacity={0.35} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.2, 2.7, 128]} />
          <meshBasicMaterial color="#D4BE8E" transparent opacity={0.45} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.7, 2.8, 128]} />
          <meshBasicMaterial color="#C4A96A" transparent opacity={0.08} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.8, 3.3, 128]} />
          <meshBasicMaterial color="#EAD6A6" transparent opacity={0.25} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[3.4, 3.7, 128]} />
          <meshBasicMaterial color="#C4A96A" transparent opacity={0.08} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
