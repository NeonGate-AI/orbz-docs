---
version: 1
name: Markdown and MDX
description: Authoring rules for accessible, searchable Nextra content.
alwaysApply: true
priority: high
tags: [markdown, mdx, content]
---

# Markdown and MDX

- Use Markdown semantics before raw HTML/JSX. Use JSX only when a component or layout need requires it.
- Keep headings hierarchical and descriptive; do not skip levels for visual styling.
- Code fences declare a language when meaningful and use Nextra copy affordances intentionally.
- Link text describes the destination; avoid generic `click here` phrasing.
- Images require meaningful alt text unless truly decorative.
- Tables require meaningful header cells and should not be used for visual layout.
- Do not use heading text, links or metadata as keyword stuffing.
