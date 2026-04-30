import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/road-safety-hero/', // 這是為了 GitHub Pages 部署設定的基礎路徑
})
