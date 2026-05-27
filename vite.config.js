import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/three/')) return 'vendor-three';
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'vendor-r3f';
          if (id.includes('node_modules/gsap/')) return 'vendor-gsap';
          if (id.includes('@studio-freight/lenis')) return 'vendor-lenis';
          if (id.includes('detect-gpu')) return 'vendor-detect';
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
})
