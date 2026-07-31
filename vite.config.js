import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://ara-tech-organization.github.io/Bonitaa-Chennai/,
  // so assets must resolve under that sub-path, not the domain root.
  base: '/Bonitaa-Chennai/',
  plugins: [react()],
})
