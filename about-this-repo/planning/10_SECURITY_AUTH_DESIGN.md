# Security and Authentication Design

**Project:** Instagram Library
**Owner:** Kevin
**Status:** Draft
**Last Updated:** 2026-10-08

## Role of Authentication

Private personal archive. Current authentication gates external ingestion only; it is not a browser login system.

## Identity Provider

Undecided. App identity is separate from Instagram authorization. Do not adopt a provider from the cloud brainstorming without verification.

## Authentication Modes

Current: server environment bearer token. Planned: authenticated browser session and manageable per-client capture tokens. No token is exposed through `VITE_` variables.

## Authentication Middleware

HTTP boundary rejects missing/wrong token before persistence. Future app-internal mutations need session enforcement and CSRF protection.

## User Model and Permissions

Single owner. No multiuser roles or RBAC schema exists. Add ownership boundaries if scope changes.

## Authorization Enforcement

Apply checks at every future data route/server function. A hidden UI control is not authorization.

## Audit Logging

Generic persistence failure messages currently avoid connection details. Plan minimal redacted audit events with explicit retention.

## Upstream Tokens and Shared Tools

No upstream Instagram/S3/AI credentials configured. Store future secrets server-side and scope them to required operations.

## Database Schema

Auth/session/token tables pending provider and lifecycle decision.

## Security Decisions

No logged-in scraping. No outbound URL fetch in capture. Future fetchers require redirect/address SSRF checks and resource limits. Define offline private-data handling before PWA caching.

## Open Questions

Identity provider, token revocation/rotation, reverse-proxy limits, backup encryption, offline retention and deletion policy.
