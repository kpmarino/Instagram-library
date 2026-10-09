export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}
export async function libraryRequest(
  path = '',
  body?: unknown,
  signal?: AbortSignal,
) {
  const response = await fetch(`/api/library${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })
  const data = await response.json()
  if (!response.ok)
    throw new ApiError(data.error ?? 'Request failed.', response.status)
  return data
}
