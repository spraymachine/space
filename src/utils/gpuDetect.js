import { getGPUTier } from 'detect-gpu';

const TIER_CONFIG = {
  0: {
    tier: 'low',
    starCount: 2000,
    planetDetail: 16,
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  1: {
    tier: 'mid',
    starCount: 4000,
    planetDetail: 32,
    dpr: [1, 1.5],
    bloom: true,
    postProcessing: false,
    shaderComplexity: 'mid',
  },
  2: {
    tier: 'high',
    starCount: 8000,
    planetDetail: 64,
    dpr: [1, 2],
    bloom: true,
    postProcessing: true,
    shaderComplexity: 'high',
  },
};

let cachedResult = null;

export async function detectGpuTier() {
  if (cachedResult) return cachedResult;

  try {
    const gpuTier = await getGPUTier();
    const tier = Math.min(gpuTier.tier, 2);
    cachedResult = { ...TIER_CONFIG[tier], raw: gpuTier };
  } catch {
    cachedResult = { ...TIER_CONFIG[0], raw: null };
  }

  return cachedResult;
}
