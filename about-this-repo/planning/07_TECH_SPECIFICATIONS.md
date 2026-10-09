# Technical Specifications

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Executive Summary

The agreed foundation is implemented. Product features remain planned. Keep domain/service logic independent of TanStack route files.

## System Architecture

TanStack Start serves SSR and the versioned ingestion server route. Validation lives in `src/domain/items`; persistence orchestration lives in `src/services/ingestion`. PostgreSQL is the runtime database. See [Architecture](../../docs/explanations/explanation-architecture.md) and ADRs in this folder.

## Technology Stack

React, TypeScript, Vite, TanStack Router/Start, Zod, Drizzle and node-postgres. PostgreSQL plus pgvector; future media in S3-compatible storage. Add Query when a real workflow warrants it. Avoid experimental RSC.

## Data Model

See [Data Model](06_DATA_MODEL.md). Capture does not fetch remote resources or run archive jobs.

## API Specifications

`POST /api/v1/items` is implemented. No GraphQL or WebSocket API is selected. Future app-internal server functions share the service layer under session authorization.

## Integration Points

No external account/provider is configured. Instagram enrichment, S3, identity, worker runtime and Shortcut integration are future adapters.

## Security

Server-only ingestion token, bounded JSON, strict validation and database uniqueness. Add session auth/CSRF, token lifecycle and ingress rate limits before public/private-library deployment. See [Security Design](10_SECURITY_AUTH_DESIGN.md).

## Performance

No production SLA set. Bound capture bodies to 32 KiB. Avoid loading the complete video archive into offline cache.

## Scalability

Single owner is the initial model. Durable asynchronous archive jobs are planned; concurrency and queue limits require provider-specific design.

## Monitoring and Observability

Current persistence failures log a generic message without connection details. Future worker metrics should record retry counts, archive outcomes and storage integrity. No alerting/tracing service is configured.

## Deployment

Local Compose is provided. Production runtime/hosting, CI and GitHub are deferred. Test the real PostgreSQL container before deployment and define migration rollback/backup procedures.

## Testing Strategy

Current unit/HTTP tests and embedded PostgreSQL integration tests run in `npm test`. Type check/build/format checks pass. Real device, real container, auth and archive acceptance tests belong to later phases.

## Dependencies

Pin reproducible dependencies with `package-lock.json`. Documentation-hub is a scaffold package, not an application runtime dependency.

## Technical Risks

Verify upstream retrieval/export behavior, iOS capabilities and provider pricing before implementing affected adapters. Older cloud claims are historical research, not verified deployment constraints.

## Future Considerations

Lexical/structured search precedes AI. Select embedding provider/dimensions with semantic search, not in the capture scaffold.

## Appendix

[Capability Inventory](12_CAPABILITY_INVENTORY.md).
