import { getGPUTier } from 'detect-gpu';

const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  (window.innerWidth <= 768);

const TIER_CONFIG = {
  0: {
    tier: 'low',
    starCount: 1000,
    planetDetail: 16,
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  1: {
    tier: 'mid',
    starCount: 3000,
    planetDetail: 24,
    dpr: [1, 1.5],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'mid',
  },
  2: {
    tier: 'high',
    starCount: 6000,
    planetDetail: 48,
    dpr: [1, 2],
    bloom: true,
    postProcessing: true,
    shaderComplexity: 'high',
  },
};

// Mobile overrides — cap quality for battery life and thermal throttling
const MOBILE_TIER_CONFIG = {
  0: {
    tier: 'low',
    starCount: 500,
    planetDetail: 12,
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  1: {
    tier: 'mid',
    starCount: 1200,
    planetDetail: 16,
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  2: {
    tier: 'high',
    starCount: 2000,
    planetDetail: 24,
    dpr: [1, 1.5],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'mid',
  },
};

let cachedResult = null;

export async function detectGpuTier() {
  if (cachedResult) return cachedResult;

  const mobile = isMobile();
  const config = mobile ? MOBILE_TIER_CONFIG : TIER_CONFIG;

  try {
    const gpuTier = await getGPUTier();
    const tier = Math.min(gpuTier.tier, 2);
    cachedResult = { ...config[tier], mobile, raw: gpuTier };
  } catch {
    cachedResult = { ...config[0], mobile, raw: null };
  }

  return cachedResult;
}
