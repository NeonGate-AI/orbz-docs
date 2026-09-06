# Repository Automation

Automation is invoked through shell entrypoints; typed backends use Node 24's
native TypeScript support. These are bounded tasks, not a custom project CLI.

- `lint-markdown.sh`: staged Markdown/MDX checks, including absolute file paths.
- `test.sh`: Node test runner for harness and editor-adapter behavior.
- `test-playground.sh`: public playground state and speech regression tests.
- `check-specs.ts`: implementation of the spec audit's metadata/evidence checks.
- `check-skills.ts`: implementation of skill metadata/reference checks.
- `check-public-boundary.ts`: candidate-text protected-identifier tripwire.

Call durable invariants through `.audits/*.audit.sh`. Tests use isolated synthetic
fixtures and do not modify repository records or call external services.
