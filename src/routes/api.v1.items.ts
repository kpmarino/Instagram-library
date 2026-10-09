import { createFileRoute } from '@tanstack/react-router'
import { getDb } from '../db/client.server'
import { saveItem } from '../services/ingestion/save-item'
import { handleIngestion } from '../services/ingestion/http.server'
export const Route = createFileRoute('/api/v1/items')({
  server: {
    handlers: {
      POST: ({ request }) =>
        handleIngestion(
          request,
          (input) => saveItem(getDb(), input),
          process.env.INGESTION_API_TOKEN,
        ),
    },
  },
})
