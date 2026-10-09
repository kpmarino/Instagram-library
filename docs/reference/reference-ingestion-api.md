# Ingestion API Reference

## Endpoint

`POST /api/v1/items`. Other operations are not implemented. TanStack handles routing/method dispatch.

## Headers

`Authorization: Bearer <INGESTION_API_TOKEN>` and `Content-Type: application/json`. Missing or example-placeholder server token yields 503; wrong/missing request token yields 401 when the server is configured. Tokens are server-only.

## Request

| Field     | Type             | Constraint                                                   |
| --------- | ---------------- | ------------------------------------------------------------ |
| `url`     | String, required | Trimmed; 1–4096 characters; HTTP(S), no embedded credentials |
| `title`   | String, optional | Trimmed; maximum 500 characters                              |
| `notes`   | String, optional | Maximum 20,000 characters                                    |
| `savedAt` | String, optional | ISO datetime with timezone offset                            |

Unknown fields are rejected. Body size is limited to 32 KiB while streaming, even without Content-Length.

## Normalization

Known Instagram hosts (`instagram.com`, `www.instagram.com`, `m.instagram.com`) with exact post/reel/tv paths are canonicalized to HTTPS/www, stripped of query/fragment, and given a shortcode source ID. Other HTTP(S) URLs are web sources; query parameters remain and fragments are removed.

## Response

JSON `{ item, created }`. New item: 201, `created: true`. Duplicate canonical URL: 200, `created: false`, existing item unchanged. Item timestamps serialize as ISO strings. Responses use `Cache-Control: no-store`.

## Errors

| Status | Meaning                                                   |
| ------ | --------------------------------------------------------- |
| 400    | Malformed JSON or failed validation; may include `issues` |
| 401    | Unauthorized request                                      |
| 413    | Body exceeds 32 KiB                                       |
| 415    | Unsupported content type                                  |
| 503    | Missing configuration or unavailable persistence          |

Persistence failures return a generic message; database connection details are not exposed. Capture never retrieves media or starts enrichment.
