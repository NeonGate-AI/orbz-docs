# Orbz Docs

Technical documentation for the `@neongate-ai/orbz` Web Component, built as a
standalone Next.js 16 + Nextra 4 application.

## Repository boundaries

- Product implementation: `NeonGate-AI/orbz`
- Framework sandboxes: `NeonGate-AI/orbz-sandbox`
- Public documentation, search, metadata and docs quality gates: this repository

The docs consume the published `@neongate-ai/orbz` package. Do not introduce
`workspace:*` coupling to product repositories.

## Local development

```bash
pnpm install
pnpm neon
pnpm dev
```

`pnpm neon` reconciles the local Neon engineering harness when needed. It is
explicit rather than an install/build lifecycle side effect.

## Engineering harness

Start with `AGENTS.md`.

- `.agents/context/`: repository facts and maps.
- `.agents/rules/`: durable constraints.
- `.agents/specs/`: spec-driven delivery contracts.
- `.agents/adrs/`: architectural decisions.
- `.agents/skills/`: local execution/review procedures.
- `.agents/roles/`: specialized review lenses.
- `.audits/`: reproducible harness/content/web-quality checks.

The harness is specialized for Nextra documentation, technical SEO,
accessibility, performance/Core Web Vitals and public-contract accuracy.

## Quality gates

Fast harness checks:

```bash
pnpm harness:check
```

Complete merge gate:

```bash
pnpm check
```

The full gate validates harness rules/specs, MDX metadata/internal links, SEO
wiring, formatting, lint, types and the production Nextra build. Web-quality
source checks do not claim WCAG conformance or production Core Web Vitals.

## Commit convention

Commits use Conventional Commits and are checked by Commitlint. Husky runs
`lint-staged` at `pre-commit` and Commitlint at `commit-msg`.

Examples:

```text
feat(docs): add locale switching guide
fix(seo): restore canonical for nested docs pages
docs(orbz): document preset palette behavior
perf(layout): reduce client-side navigation work
feat(api)!: document renamed public attribute
```

`feat`/`fix` provide the normal semantic-versioning signal; `!` or a
`BREAKING CHANGE:` footer marks a breaking change.

## Deployment

The repository deploys as a standalone Vercel application.

- Root Directory: `.`
- Install Command: `pnpm install --no-frozen-lockfile`
- Build Command: `pnpm build`
- Node.js: `24.x`
- Optional canonical URL override: `NEXT_PUBLIC_SITE_URL`

The build runs Pagefind after Next.js so Nextra search can use the generated
static index.

### Dependency-lock bootstrap

This harness adds Commitlint, lint-staged and Husky as exact dev dependencies.
The archive was assembled in an isolated environment where the npm registry was
not reachable, so the new dependency graph could not be materialized into
`pnpm-lock.yaml`. CI and Vercel therefore use `--no-frozen-lockfile` for this
bootstrap. On the first networked checkout, run `pnpm install`, commit the
updated lockfile, then restore `--frozen-lockfile` in CI and `vercel.json`.

## Orbz dependency

The site currently consumes `@neongate-ai/orbz@0.3.1`, including the optional
`@neongate-ai/orbz/react-types` JSX augmentation. Publish the referenced product
version before deploying docs that depend on its new public contract.
