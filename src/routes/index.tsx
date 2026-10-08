import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({ component: Home })
function Home() {
  return (
    <main>
      <h1>Personal Library</h1>
      <p>A home for saved links, your notes, and archived media.</p>
      <section aria-labelledby="library-heading">
        <h2 id="library-heading">Library foundation</h2>
        <p>
          The ingestion API is ready for authenticated URL capture. Browsing and
          capture controls will follow.
        </p>
      </section>
    </main>
  )
}
