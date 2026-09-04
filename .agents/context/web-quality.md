# Web Quality Evidence Model

SEO, accessibility and performance are part of the documentation architecture,
not a post-release cleanup pass.

## Accessibility

Target WCAG 2.2 Level AA. Prefer native semantics, keyboard-operable controls,
visible focus, sufficient contrast, correct language, reduced-motion behavior
and accessible names. Automated checks can find defects but cannot establish
conformance.

## Technical SEO

The repository must preserve:

- indexable public routes;
- self-consistent canonical URLs;
- `robots.txt` discovery of `sitemap.xml`;
- sitemap coverage for intended indexable content;
- unique titles and descriptions;
- Open Graph/Twitter defaults with page-level metadata inheritance;
- semantic headings and descriptive links;
- fast, stable rendering on mobile.

Structured data is added only when the page has content that genuinely matches
the schema. Do not add schema solely to chase a score.

## Core Web Vitals

Field targets at the 75th percentile:

| Metric | Good |
|---|---:|
| LCP | <= 2.5 s |
| INP | <= 200 ms |
| CLS | <= 0.1 |

A local build, Lighthouse run or source audit is diagnostic evidence. Only
representative field/RUM/CrUX data can establish real-user CWV status.

For this Nextra site, common risks include unnecessary Client Components,
JavaScript-heavy custom navigation, unreserved media dimensions, large hero
assets, font loading, third-party scripts and hydration work that duplicates
static content behavior.

## Evidence labels

Use one of these labels in audit/review notes:

- `source`: directly verified in repository source/configuration;
- `build`: verified by deterministic build output;
- `lab`: synthetic browser measurement;
- `field`: production real-user measurement;
- `manual`: human interaction/assistive-technology observation;
- `hypothesis`: plausible but not yet measured or observed.

Never convert one evidence class into another in prose.
