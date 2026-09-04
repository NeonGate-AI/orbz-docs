---
version: 1
name: Rules Index
description: Stable catalog of durable Orbz Docs repository constraints.
alwaysApply: true
priority: high
tags: [harness, rules]
---

# Rules

Rules are durable constraints. Numeric IDs are stable identities, not precedence.
New rules receive the next unused ID; do not renumber existing rules to reorder
them.

| ID | Rule |
|---:|---|
| 001 | [Repository architecture](001-architecture.rule.md) |
| 002 | [Code style](002-code-style.rule.md) |
| 003 | [Context engineering](003-context-engineering.rule.md) |
| 004 | [Documentation content contracts](004-content-contracts.rule.md) |
| 005 | [Markdown and MDX](005-markdown.rule.md) |
| 006 | [Accessibility](006-accessibility.rule.md) |
| 007 | [Technical SEO](007-seo.rule.md) |
| 008 | [Performance and Core Web Vitals](008-performance-core-web-vitals.rule.md) |
| 009 | [React, Next.js and Nextra](009-react-and-next.rule.md) |
| 010 | [Source organization](010-source-organization.rule.md) |
| 011 | [Spec-driven development](011-spec-driven-development.rule.md) |
| 012 | [Security and privacy](012-security-privacy.rule.md) |

When a rule can be checked mechanically, `.audits/` or a normal test should
enforce it. Avoid duplicating exact rule text in skills or context files.
