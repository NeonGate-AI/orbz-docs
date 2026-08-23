# Neongate AI Docs

Central technical documentation for Neongate AI products and engineering.

## Local development

```bash
pnpm install
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
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Node.js: `24.x`
- Optional canonical URL override: `NEXT_PUBLIC_SITE_URL`

Product implementations are maintained in their own repositories. This site
consumes their published packages and documents their public contracts.

## Orbz dependency

This site consumes the published `@neongate-ai/orbz@0.3.0` package, including
the optional `@neongate-ai/orbz/react-types` JSX augmentation. Publish Orbz
`0.3.0` before installing or deploying this repository.
