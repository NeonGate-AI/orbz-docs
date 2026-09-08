# Audits

`.audits/` contains reproducible repository checkers and temporary audit evidence.
Committed executable checkers end in `.audit.sh`. Generated reports/logs are
ignored by Git and are not canonical engineering context.

Current checkers:

- `public-boundary.audit.sh`: candidate text and editor protected-identifier regression checks.
- `guardrails.audit.sh`: optional editor protocol, shell syntax and review-agent contracts.
- `architecture.audit.sh`: standalone Nextra/docs topology and forbidden legacy assumptions.
- `rules.audit.sh`: rule catalog identities/frontmatter/index coverage.
- `specs.audit.sh`: numbered spec naming/frontmatter/catalog consistency.
- `workflow-skills.audit.sh`: local skill catalog/invocation references.
- `content.audit.sh`: MDX metadata, internal routes and current release alignment
  with the installed package: dependency, newest changelog, CDN introduction/pins
  and public-contract version/default/canonical preset list. Historical releases
  remain outside the current-version check.
- `accessibility.audit.sh`: source semantics, controls, focus/motion/forced-colors and stable contrast contracts.
- `web-quality.audit.sh`: deterministic canonical, social metadata, indexing, sitemap and image contracts.
- `built-web-quality.audit.sh`: post-build generated metadata, served icon links
  and accessible form-label contracts across authored pages.
- `performance.audit.sh`: static-rendering, client-boundary and heavyweight-runtime source budgets.
- `security.audit.sh`: CSP/headers, reproducible installs, immutable Actions and dependency/source security contracts.
- `git-workflow.audit.sh`: Commitlint, lint-staged, Husky hooks and CI wiring.

`pnpm harness:check` runs the committed source-contract suite. `pnpm test` executes isolated behavioral fixtures. `pnpm check` adds
Biome, TypeScript and a production Nextra/Next.js build. CI additionally runs
`pnpm security:audit` against the registry for high/critical production-package
advisories.

Source checks are evidence, not claims of field conformance. Accessibility still
requires manual keyboard/screen-reader/zoom checks, and Core Web Vitals still
require production field data (RUM/CrUX) at the 75th percentile. Promote durable
findings into `.agents/` or tests; do not keep long-lived truth only in an audit
report.
