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
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { libraryRequest, ApiError } from './api'
export type LinkItem = {
  id: string
  title: string | null
  notes: string | null
  canonicalUrl: string
  savedAt: string
}
export function LinkDialog({
  item,
  onClose,
  onSaved,
  onExpired,
}: {
  item: LinkItem | null
  onClose: () => void
  onSaved: (created: boolean) => void
  onExpired: () => void
}) {
  const [url, setUrl] = useState(item?.canonicalUrl ?? '')
  const [title, setTitle] = useState(item?.title ?? '')
  const [notes, setNotes] = useState(item?.notes ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await libraryRequest('', {
        action: item ? 'edit' : 'capture',
        input: item ? { id: item.id, title, notes } : { url, title, notes },
      })
      onSaved(item ? true : result.created)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onExpired()
      else setError(e instanceof Error ? e.message : 'Unable to save link.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose()
      }}
    >
      <DialogContent
        className="sm:max-w-lg max-h-[90dvh] overflow-y-auto"
        showCloseButton={!busy}
      >
        <DialogHeader>
          <DialogTitle>{item ? 'Edit link' : 'Add link'}</DialogTitle>
          <DialogDescription>
            {item
              ? 'Update your title and notes.'
              : 'Save a URL and your own notes. Media is not downloaded.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input
                id="url"
                type="url"
                required
                maxLength={4096}
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={busy || !!item}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="title">Title (optional)</FieldLabel>
              <Input
                id="title"
                maxLength={500}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={busy}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
              <Textarea
                id="notes"
                maxLength={20000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={busy}
                className="max-h-64"
              />
            </Field>
          </FieldGroup>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Spinner data-icon="inline-start" />}
              {item ? 'Save changes' : 'Save link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
