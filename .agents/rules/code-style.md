---
version: 1
name: Docs Code Style
description: Code conventions for the Next.js and Nextra documentation application.
alwaysApply: true
priority: high
---

# Docs Code Style

- Use strict TypeScript.
- Use function declarations for React components.
- Use interfaces for object-shaped contracts.
- Use single quotes in TypeScript and JavaScript.
- Keep server components as the default; add `use client` only when required.
- Keep product registration side effects isolated in explicit client modules.
- Avoid product business logic in the documentation application.

## Orbz React typing

- Use `@neongate-ai/orbz/react-types` for JSX awareness of `<orb-z>`.
- Do not maintain a local duplicate custom-element JSX declaration.
