import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Login } from './login'
import { BulkDialog } from './bulk-dialog'
import { LinkDialog, type LinkItem } from './link-dialog'
import { ApiError, libraryRequest } from './api'
export function LibraryPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [items, setItems] = useState<LinkItem[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)
  const [dialog, setDialog] = useState<LinkItem | null | undefined>(undefined)
  const [signingOut, setSigningOut] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  function expire() {
    setAuthenticated(false)
    setItems([])
    setDialog(undefined)
    setBulkOpen(false)
    setNotice('')
    setError('')
  }
  useEffect(() => {
    if (authenticated === false) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    const timer = setTimeout(
      () => {
        libraryRequest(
          `?q=${encodeURIComponent(query)}&page=${page}`,
          undefined,
          controller.signal,
        )
          .then((data) => {
            setAuthenticated(true)
            setItems(data.items)
            setHasMore(data.hasMore)
          })
          .catch((e) => {
            if (controller.signal.aborted) return
            if (e instanceof ApiError && e.status === 401) expire()
            else
              setError(e instanceof Error ? e.message : 'Unable to load links.')
          })
          .finally(() => {
            if (!controller.signal.aborted) setLoading(false)
          })
      },
      query ? 250 : 0,
    )
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [authenticated, query, page, revision])
  const date = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  const edit = (item: LinkItem) => (
    <Button
      variant="outline"
      aria-label={`Edit ${item.title || item.canonicalUrl}`}
      onClick={() => {
        setNotice('')
        setDialog(item)
      }}
    >
      Edit
    </Button>
  )
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 sm:px-10 sm:py-10">
      <header className="flex items-center justify-between gap-4">
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">
          Personal Library
        </p>
        {authenticated && (
          <Button
            variant="outline"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true)
              try {
                await libraryRequest('', { action: 'logout' })
                expire()
              } catch (e) {
                if (e instanceof ApiError && e.status === 401) expire()
                else setError('Unable to sign out. Try again.')
              } finally {
                setSigningOut(false)
              }
            }}
          >
            Sign out
          </Button>
        )}
      </header>
      <Separator />
      {authenticated === false ? (
        <Login
          onSignedIn={() => {
            setAuthenticated(true)
            setRevision((r) => r + 1)
          }}
        />
      ) : (
        <section
          className="flex flex-col gap-6"
          aria-labelledby="library-heading"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1
              id="library-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              Saved links
            </h1>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="lg"
                disabled={!authenticated}
                onClick={() => {
                  setNotice('')
                  setBulkOpen(true)
                }}
              >
                Bulk add
              </Button>
              <Button
                size="lg"
                disabled={!authenticated}
                onClick={() => {
                  setNotice('')
                  setDialog(null)
                }}
              >
                Add link
              </Button>
            </div>
          </div>
          <Input
            aria-label="Search saved links"
            placeholder="Search saved links…"
            type="search"
            maxLength={200}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
              setNotice('')
            }}
            disabled={!authenticated}
          />
          {notice && (
            <p role="status" className="text-sm text-muted-foreground">
              {notice}
            </p>
          )}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {error}{' '}
                <Button
                  variant="outline"
                  onClick={() => setRevision((r) => r + 1)}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : loading ? (
            <div
              aria-label="Loading links"
              aria-busy="true"
              className="flex flex-col gap-3"
            >
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !items.length ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>
                  {query ? 'No matching links' : 'No saved links yet'}
                </EmptyTitle>
                <EmptyDescription>
                  {query
                    ? 'Try a different search.'
                    : 'Add a link to start your library.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="hidden rounded-lg border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Saved date</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-60 whitespace-normal font-medium break-words">
                          {item.title || 'Untitled link'}
                        </TableCell>
                        <TableCell className="max-w-64 whitespace-normal break-all">
                          <a
                            href={item.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground underline-offset-4 hover:underline"
                          >
                            {item.canonicalUrl}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-72 whitespace-normal">
                          <p className="line-clamp-3 break-words text-muted-foreground">
                            {item.notes || '—'}
                          </p>
                        </TableCell>
                        <TableCell>{date(item.savedAt)}</TableCell>
                        <TableCell>{edit(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="flex flex-col gap-3 md:hidden">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="min-w-0 break-words font-medium">
                        {item.title || 'Untitled link'}
                      </h2>
                      {edit(item)}
                    </div>
                    <a
                      href={item.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {item.canonicalUrl}
                    </a>
                    {item.notes && (
                      <p className="line-clamp-3 break-words text-sm">
                        {item.notes}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {date(item.savedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!loading && authenticated && (page > 0 || hasMore) && (
            <nav
              aria-label="Link pages"
              className="flex items-center justify-end gap-3"
            >
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">Page {page + 1}</span>
              <Button
                variant="outline"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </section>
      )}
      {bulkOpen && authenticated && (
        <BulkDialog
          onClose={() => setBulkOpen(false)}
          onExpired={expire}
          onImported={() => {
            setQuery('')
            setPage(0)
            setRevision((r) => r + 1)
          }}
        />
      )}
      {dialog !== undefined && authenticated && (
        <LinkDialog
          item={dialog}
          onClose={() => setDialog(undefined)}
          onExpired={expire}
          onSaved={(created) => {
            setDialog(undefined)
            setNotice(
              created
                ? 'Saved.'
                : 'Already saved. Your existing title and notes were kept.',
            )
            setQuery('')
            setPage(0)
            setRevision((r) => r + 1)
          }}
        />
      )}
    </main>
  )
}
