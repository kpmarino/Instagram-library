import { createFileRoute } from '@tanstack/react-router'
import { getDb } from '../db/client.server'
import { handleLibrary } from '../services/auth/library-http.server'

const handle = ({ request }: { request: Request }) =>
  handleLibrary(request, getDb, process.env.OWNER_PASSWORD_HASH)
export const Route = createFileRoute('/api/library')({
  server: { handlers: { GET: handle, POST: handle } },
})
