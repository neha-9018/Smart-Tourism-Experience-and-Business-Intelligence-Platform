import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Ensure PostCSS (and thus Tailwind) processes CSS during build
    postcss: './postcss.config.cjs',
  },
})
