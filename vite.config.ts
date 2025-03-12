// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: 'https://github.com/robsonmouras/puff-control.git', // Substitua pelo nome do seu repositório
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Garante que @ aponte para src/
    },
  },
})
