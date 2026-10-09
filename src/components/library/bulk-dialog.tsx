import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { parseBulkLinks, type BulkReport } from '@/domain/items/bulk'
import { libraryRequest, ApiError } from './api'

export function BulkDialog({
  onClose,
  onImported,
  onExpired,
}: {
  onClose: () => void
  onImported: () => void
  onExpired: () => void
}) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<BulkReport | null>(null)
  let count = 0
  let invalid = 0
  let validation = ''
  if (text.trim())
    try {
      const entries = parseBulkLinks(text)
      count = entries.length
      invalid = entries.filter((e) => e.error).length
    } catch (e) {
      validation = e instanceof Error ? e.message : 'Check your list.'
    }
  const labels = {
    saved: 'Saved',
    duplicate: 'Already saved',
    invalid: 'Invalid',
    failed: 'Failed',
  }
  function revise(value: string) {
    setText(value)
    setReport(null)
    setError('')
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose()
      }}
    >
      <DialogContent
        className="sm:max-w-xl max-h-[90dvh] overflow-y-auto"
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle>Bulk add links</DialogTitle>
          <DialogDescription>
            Paste your extracted links, one per line. Existing titles and notes
            are kept. Media is not downloaded.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          onSubmit={async (event) => {
            event.preventDefault()
            setBusy(true)
            setError('')
            try {
              const result: BulkReport = await libraryRequest('', {
                action: 'bulk-capture',
                text,
              })
              setReport(result)
              onImported()
            } catch (e) {
              if (e instanceof ApiError && e.status === 401) onExpired()
              else if (e instanceof ApiError && e.status === 413)
                setError(
                  'This list is too large to send. Split it into smaller batches.',
                )
              else if (e instanceof ApiError && e.status === 400)
                setError(e.message)
              else {
                setError(
                  'Import could not finish. Some links may have saved; retrying this list is safe.',
                )
                onImported()
              }
            } finally {
              setBusy(false)
            }
          }}
        >
          <FieldGroup>
            <Field data-invalid={!!validation}>
              <FieldLabel htmlFor="bulk-links">Links</FieldLabel>
              <Textarea
                id="bulk-links"
                rows={7}
                className="min-h-40 max-h-64"
                value={text}
                disabled={busy}
                aria-invalid={!!validation}
                aria-describedby="bulk-help"
                onChange={(e) => revise(e.target.value)}
                placeholder={
                  'https://www.instagram.com/p/…/\nhttps://example.com/…'
                }
              />
              <FieldDescription id="bulk-help">
                Up to 100 links and 20,000 characters. Plain URLs, bullets,
                numbered lists and Markdown links are supported.
              </FieldDescription>
            </Field>
          </FieldGroup>
          {validation && (
            <Alert variant="destructive">
              <AlertDescription>{validation}</AlertDescription>
            </Alert>
          )}
          {!report && count > 0 && (
            <p role="status" className="text-sm text-muted-foreground">
              {count} entries · {count - invalid} valid · {invalid} invalid.
              Invalid entries will be skipped and listed in the results.
            </p>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {report && (
            <section
              aria-label="Import results"
              className="flex flex-col gap-3"
            >
              <p role="status" className="text-sm">
                {report.counts.saved} saved · {report.counts.duplicate} already
                saved · {report.counts.invalid} invalid · {report.counts.failed}{' '}
                failed
              </p>
              <ol
                className="flex max-h-60 flex-col gap-3 overflow-y-auto text-sm"
                tabIndex={0}
                aria-label="Per-link results"
              >
                {report.results.map((result) => (
                  <li key={result.line} className="flex flex-col gap-1">
                    <p className="font-medium">
                      Line {result.line}: {labels[result.status]}
                    </p>
                    <p className="break-all text-muted-foreground">
                      {result.url}
                    </p>
                    {result.error && <p>{result.error}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          <DialogFooter>
            {report ? (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => revise(text)}
                >
                  Edit list
                </Button>
                {report.counts.failed > 0 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      revise(
                        report.results
                          .filter((r) => r.status === 'failed')
                          .map((r) => r.url)
                          .join('\n'),
                      )
                    }
                  >
                    Retry failed links
                  </Button>
                )}
                <Button type="button" onClick={onClose}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  type="button"
                  disabled={busy}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={busy || !!validation || count - invalid === 0}
                >
                  {busy && <Spinner data-icon="inline-start" />}
                  {busy ? 'Importing…' : 'Import links'}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
