import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['DATABASE_URL', 'INGESTION_API_TOKEN']) {
    if (process.env[key] === undefined && env[key]) process.env[key] = env[key]
  }
  return {
    server: { port: 3000, host: '127.0.0.1' },
    plugins: [tanstackStart(), react()],
  }
})
