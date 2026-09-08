# Content Architecture

Orbz Docs uses the Nextra 4 `content` directory convention with one App Router
catch-all route.

## Routing

`content/index.mdx` maps to `/`.
`content/orbz/index.mdx` maps to `/orbz`.
Other `.md` or `.mdx` files map to their relative content path without the file
extension; `index` collapses to its parent route.

The catch-all route in `app/[[...mdxPath]]/page.tsx` must keep Nextra's
`generateStaticParamsFor` and `importPage` flow unless a spec explicitly changes
routing strategy.

## Navigation

Co-located `_meta.ts` files own sidebar/navigation labels and ordering. A page
may exist without global navigation only when that is intentional and recorded.
Do not duplicate navigation truth in unrelated configuration.

## Page contract

The catch-all metadata function owns the final browser/Open Graph/Twitter title
using an absolute Next.js title. Home and its /orbz alias use siteConfig.homeTitle;
leaf titles include the Docs brand once. Nextra navigation labels do not own
document titles. App Router metadata files own the favicon and touch icons.

Every indexable documentation page must have:

- a unique, human-readable `title`;
- a useful, page-specific `description`;
- one clear primary topic and logical heading hierarchy;
- descriptive internal link text;
- code examples that match the published Orbz API;
- an intentional canonical route.

Nextra's Docs Theme provides the shell, sidebar, TOC, copy-page affordance and
other documentation behavior. Prefer built-in Nextra capabilities over custom
implementations when they satisfy the requirement.

## Search

Nextra search is enabled with Pagefind. The production build generates the
static search index after Next.js build. Search must index documentation body
content while avoiding noisy code-block indexing unless a spec changes that
trade-off.

## Content changes

A public API documentation change should be traceable to product evidence such
as the published package, release notes or a product repository change. A style
or information-architecture change remains owned here.
