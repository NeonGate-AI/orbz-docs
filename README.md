# Orbz Docs

Public documentation and an interactive playground for the
[`@neongate-ai/orbz`](https://www.npmjs.com/package/@neongate-ai/orbz)
Web Component. Built with Next.js 16, Nextra 4, React and TypeScript.

[Read the documentation](https://orbz.site) ·
[Component repository](https://github.com/NeonGate-AI/orbz) ·
[Framework examples](https://github.com/NeonGate-AI/orbz-sandbox)

## Local development

Use Node.js 24 and the pnpm version pinned in `package.json`.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

The exact published Orbz dependency in `package.json` drives the version badge.
Docs own content, navigation, examples, search, metadata and documentation UI;
component implementation and package publishing belong to the component repo.

## Contributing

Start with [AGENTS.md](AGENTS.md). Substantial changes use a numbered specification
before implementation, reproducible evidence and independent standards/spec
review. Pull requests target `main`; this repository has no staging branch flow.

```sh
corepack pnpm test
corepack pnpm harness:check
corepack pnpm check
corepack pnpm security:audit
```

`check` runs the deterministic harness, behavioral tests, formatting, lint,
TypeScript and production build. `security:audit` separately checks production
package advisories. Git hooks validate staged source/Markdown and Conventional
Commit messages. There is no custom engineering CLI.

## Engineering harness

| Area | Ownership |
|---|---|
| `.agents/context/` | Repository facts and task maps |
| `.agents/rules/` | Durable constraints |
| `.agents/specs/` | Numbered contracts and acceptance evidence |
| `.agents/adrs/` | Consequential architecture decisions |
| `.agents/skills/` | Local execution and review procedures |
| `.agents/roles/` | Specialized review responsibilities |
| `.agents/workflows/` | Reusable development and review sequences |
| `.agents/prompts/` | Artifact templates |
| `.audits/` | Deterministic shell checks and ignored temporary reports |
| `.cursor/` | Optional tested editor hooks and a review-only agent |

Run the diagnostic explicitly with `npx harness-score`, or `corepack pnpm harness`
for the recorded scorer version. Evaluate the actual gaps and evidence instead
of treating the number as a security or quality certification.

The public-boundary check covers tracked and new candidate text, including editor
settings. Additional owner-maintained protected terms can be supplied through
`DOCS_PRIVATE_TERMS_FILE` pointing to a local file outside the repository; findings
print paths/categories without matched text. Binary assets and Git history need
separate review before a repository visibility change.

## Quality and deployment

Authored pages target WCAG 2.2 AA and consistent titles, canonicals, sitemaps and
search discovery. Browser/assistive-technology evidence complements automated
checks. Core Web Vitals claims require representative field measurements.

The Vercel project uses repository root `.`, Node.js 24,
`pnpm install --frozen-lockfile` and `pnpm build`. Pagefind indexes the static
output after each production build. `NEXT_PUBLIC_SITE_URL` optionally overrides
the canonical host; preview deployments remain non-indexable.

Provider credentials belong to the consuming application's server. Examples use
public model settings and application-owned authorization boundaries. The local
speech playground does not require a provider key.
