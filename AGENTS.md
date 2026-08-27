# Orbz Docs Engineering Instructions

This repository owns the public documentation site for `@neongate-ai/orbz`.

Read and follow:

1. `.agents/rules/repository-scope.md`
2. `.agents/rules/content-organization.md`
3. `.agents/rules/code-style.md`

## Product boundaries

- Orbz implementation belongs to `NeonGate-AI/orbz`.
- Orbz framework sandboxes belong to `NeonGate-AI/orbz-sandbox`.
- This repository consumes the published `@neongate-ai/orbz` package.
- Do not reintroduce `workspace:*` dependencies on product repositories.
- Run `pnpm check` before merging documentation application changes.

## Neon CLI

- Run `pnpm neon` after dependency installation when the repository harness needs to be bootstrapped or reconciled.
- Do not run Neon setup automatically from install, build, or CI lifecycle hooks.
