# Local Development Troubleshooting

## Symptoms and Checks

| Symptom                   | Check                                             | Recovery                                                       |
| ------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Docker cannot connect     | `docker info`                                     | Start your configured Docker runtime, then retry Compose       |
| Port 5432 busy            | `docker compose ps` and local process inventory   | Use an available local port consistently in Compose and `.env` |
| API returns 503           | Server token and database availability/migrations | Set a real token, start DB and apply migration                 |
| API returns 401           | Client Authorization header                       | Use the configured token; do not print it in logs              |
| API returns 400/413/415   | Body/schema/content type                          | Follow the API reference                                       |
| Missing vector extension  | PostgreSQL image/capability                       | Use pgvector-capable runtime before migration                  |
| Git metadata write denied | Codex sandbox approval result                     | Request scoped Git permission; keep development sandboxed      |

## Safe Recovery

Use `docker compose stop` to stop the database without deleting its volume. Do not remove volumes, reset Git or overwrite user `.env` files as routine recovery.

## Verification

Run `npm test`, type check and build after functional fixes. The tests use embedded PostgreSQL; a successful suite does not demonstrate that the local Docker daemon or cloud runtime is healthy.

## Escalation

Record exact error and redacted configuration in a dated working note. Do not paste tokens, connection credentials or private saved data into external issues.
