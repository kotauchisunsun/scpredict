import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  root: "packages/ui",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tfjs: ['@tensorflow/tfjs'],
          plotly: ['react-plotly.js']
        }
      }
    },
  }
})
