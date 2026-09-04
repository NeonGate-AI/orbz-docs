---
id: ADR-003
title: Preserve static rendering with a restrictive compatible CSP
status: accepted
date: 2026-09-04
owners: [NeonGate AI]
supersedes: none
---

# ADR-003: Preserve static rendering with a restrictive compatible CSP

## Context

OrbZ Docs is a public Nextra documentation site whose primary delivery model is
static MDX and cacheable Next.js output. It also uses Pagefind, which compiles
WebAssembly and runs search in a Web Worker.

A strict per-request nonce CSP would provide stronger protection for inline
scripts, but current Next.js nonce support requires dynamic rendering so a fresh
nonce can be generated on every request. That disables static optimization and
normal CDN caching for the affected pages. The docs do not process credentials,
authenticated application state, or user-generated HTML, so forcing every page
through dynamic rendering would trade a material performance property for a
security control whose marginal value is lower in this threat model.

Next.js documents a static-compatible CSP mode that permits framework inline
scripts, and Pagefind documents the narrower `wasm-unsafe-eval` permission plus
`worker-src` needed by its search runtime.

## Decision

Keep the documentation statically renderable and apply a production CSP from
`next.config.mjs` with these boundaries:

- same-origin by default;
- inline scripts allowed only because the current static Next.js runtime needs
  them; JavaScript `eval()` remains forbidden in production;
- WebAssembly compilation is allowed with `wasm-unsafe-eval` specifically for
  Pagefind instead of the broader `unsafe-eval`;
- inline event-handler attributes are blocked with `script-src-attr 'none'`;
- objects and frames are blocked;
- base URLs and form submissions are same-origin;
- workers are same-origin/blob for Pagefind;
- images, fonts, media, connections, and manifests are constrained to the
  sources the current site actually uses;
- insecure subresources are upgraded in production.

Development may add `unsafe-eval` and WebSocket connections because React
source diagnostics and Next.js HMR require them. Those allowances are not
present in production.

Defense-in-depth headers are emitted alongside CSP, including HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options`, cross-origin opener/resource policies, and an explicit
`X-XSS-Protection: 0` for legacy browser behavior.

## Consequences

The docs retain static generation, CDN cacheability, and Pagefind search while
substantially reducing the browser resource and embedding surface.

The policy does not claim to be a nonce-level strict CSP because
`script-src 'unsafe-inline'` remains necessary for the current static Next.js
output. If Next.js SRI support becomes stable and verified with Nextra/Pagefind,
or if the docs begin handling sensitive authenticated/user-generated data, this
ADR must be revisited.

Any new analytics, embeds, remote images, fonts, API connections, or media hosts
will fail closed until their origin is reviewed and deliberately added.

## Alternatives rejected

- **Per-request nonces:** rejected for this site because current Next.js support
  forces dynamic rendering and removes the static/CDN performance model.
- **Experimental SRI as a production dependency:** rejected until the Next.js
  feature is stable and verified end-to-end with Nextra and Pagefind.
- **No CSP:** rejected because the site can constrain almost every resource class
  without affecting its intended behavior.
- **`unsafe-eval` in production:** rejected; Pagefind only requires the narrower
  WebAssembly-specific permission.
