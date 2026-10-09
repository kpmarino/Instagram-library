import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { libraryRequest } from './api'
export function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <section
      className="mx-auto flex w-full max-w-sm flex-col gap-6 py-20"
      aria-labelledby="login-heading"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="login-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground">
          Your links and notes are private.
        </p>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          setError('')
          try {
            await libraryRequest('', { action: 'login', password })
            setPassword('')
            onSignedIn()
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to sign in.')
          } finally {
            setBusy(false)
          }
        }}
      >
        <FieldGroup>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="password">Owner password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
              disabled={busy}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertDescription id="login-error">{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={busy}>
          {busy && <Spinner data-icon="inline-start" />}Sign in
        </Button>
      </form>
    </section>
  )
}
