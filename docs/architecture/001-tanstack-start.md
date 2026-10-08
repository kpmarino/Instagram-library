# ADR 001: TanStack Start

Status: accepted.

Use TanStack Start, React, TypeScript and Vite for this personal learning project. Router conventions, SSR and server routes keep the shell and external capture API in one application. Keep validation and services outside routes so a framework migration does not require rewriting the domain. Avoid experimental RSC. Add TanStack Query when a concrete server-state workflow warrants it.

The initial shell is responsive but intentionally minimal. Product UI work will prioritize iPad Mini, iPad and desktop; iPhone primarily handles capture. Offline/install support is a follow-up, not an implied capability of SSR.
