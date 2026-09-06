# Documentation Change Workflow

## Public-contract changes

When documenting an Orbz API, attribute, method, event, preset, custom color,
state, speech locale or runtime behavior:

1. verify the published package/release or canonical product source;
2. identify the exact audience task the page must support;
3. update one canonical explanation and link to it rather than duplicating truth;
4. update navigation/search discovery when a new page is introduced;
5. verify titles, descriptions, canonical/sitemap coverage and internal links;
6. verify examples remain keyboard/screen-reader safe and respect motion choices;
7. run the repository gate.

The current public element contract uses `preset` plus five `color-*` attributes
for appearance. There is no public `palette` attribute/property. Treat any
proposal to change that vocabulary as a product-contract change, not a docs-only
rename.

## Nextra changes

Prefer Nextra 4 built-ins and file conventions. Before adding a custom component,
check whether the Docs Theme or `nextra/components` already owns the behavior.
Custom Client Components require a concrete interaction need; static content
belongs in Server Components/MDX by default.

## Review dimensions

- Accuracy against the published Orbz contract.
- Findability and task-oriented information architecture.
- Semantic HTML and WCAG 2.2 AA risks.
- Metadata/crawl/canonical consistency.
- JavaScript, rendering and layout-stability cost.
