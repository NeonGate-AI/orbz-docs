# Orbz Docs

Technical documentation for the `@neongate-ai/orbz` Web Component.

## Local development

```bash
pnpm install --frozen-lockfile
pnpm neon
pnpm dev
```

## Quality gate

```bash
pnpm check
```

## Deployment

The repository is a standalone Next.js/Nextra application.

- Vercel Root Directory: `.`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Node.js: `24.x`
- Optional canonical URL override: `NEXT_PUBLIC_SITE_URL`

The Orbz implementation remains in the
[`NeonGate-AI/orbz`](https://github.com/NeonGate-AI/orbz) repository, and the
framework sandboxes remain in
[`NeonGate-AI/orbz-sandbox`](https://github.com/NeonGate-AI/orbz-sandbox).
This site consumes the published package and documents its public contract.

## Orbz dependency

This site consumes the published `@neongate-ai/orbz@0.3.1` package, including
the optional `@neongate-ai/orbz/react-types` JSX augmentation. Publish Orbz
`0.3.1` before installing or deploying this repository.
