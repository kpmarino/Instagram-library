import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of [
    'DATABASE_URL',
    'INGESTION_API_TOKEN',
    'OWNER_PASSWORD_HASH',
  ]) {
    if (process.env[key] === undefined && env[key]) process.env[key] = env[key]
  }
  return {
    server: { port: 3000, host: '127.0.0.1' },
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    plugins: [tailwindcss(), tanstackStart(), react()],
  }
})
