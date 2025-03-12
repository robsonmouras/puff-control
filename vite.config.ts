// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: 'https://github.com/robsonmouras/puff-control.git', // Substitua pelo nome do seu repositório
})
