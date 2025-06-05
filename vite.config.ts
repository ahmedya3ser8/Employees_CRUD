import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, './src/assets'),
      "@components": path.resolve(__dirname, './src/components'),
      "@hooks": path.resolve(__dirname, './src/hooks'),
      "@pages": path.resolve(__dirname, './src/pages'),
      "@services": path.resolve(__dirname, './src/services'),
      "@styles": path.resolve(__dirname, './src/styles'),
      "@interfaces": path.resolve(__dirname, './src/interfaces'),
      "@validations": path.resolve(__dirname, './src/validations')
    }
  },
  plugins: [react()]
})
