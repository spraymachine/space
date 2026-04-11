import { useState, useEffect } from 'react';
import { detectGpuTier } from '../../../utils/gpuDetect';

const DEFAULT_TIER = {
  tier: 'low',
  starCount: 2000,
  planetDetail: 16,
  dpr: [1, 1],
  bloom: false,
  postProcessing: false,
  shaderComplexity: 'low',
};

export function useGpuTier() {
  const [config, setConfig] = useState(DEFAULT_TIER);

  useEffect(() => {
    detectGpuTier().then(setConfig);
  }, []);

  return config;
}
