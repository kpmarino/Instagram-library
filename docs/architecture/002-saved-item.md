# ADR 002: Source-independent SavedItem

Status: accepted.

Use `SavedItem` with source, original URL and canonical URL, rather than `InstagramPost`. Recognize Instagram post/reel/tv shortcodes locally and remove their sharing parameters. Preserve query parameters for generic URLs because they can identify distinct resources; remove fragments.

An exact allowlist of Instagram hostnames prevents unrelated domains from being classified as Instagram. Arbitrary HTTP(S) links can be captured as web sources. URL capture does not claim metadata retrieval or fetch the URL. Future adapters must separately handle SSRF protection and media retrieval.

Canonical URL is the initial deduplication boundary. Do not collapse distinct Instagram route types solely by shortcode until an adapter confirms equivalence. Preserve immutable capture/source fields and explicitly edit user metadata in later workflows.
