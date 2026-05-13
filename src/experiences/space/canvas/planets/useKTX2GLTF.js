import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Cache = new WeakMap();

function getKTX2Loader(gl) {
  if (!ktx2Cache.has(gl)) {
    const loader = new KTX2Loader()
      .setTranscoderPath('/basis/')
      .detectSupport(gl);
    ktx2Cache.set(gl, loader);
  }
  return ktx2Cache.get(gl);
}

export function useKTX2GLTF(url) {
  const { gl } = useThree();
  const ktx2Loader = useMemo(() => getKTX2Loader(gl), [gl]);
  return useGLTF(url, true, true, (loader) => loader.setKTX2Loader(ktx2Loader));
}
