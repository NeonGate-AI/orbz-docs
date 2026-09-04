---
version: 1
name: Accessibility
description: WCAG 2.2 AA constraints for documentation UI and content.
alwaysApply: true
priority: high
tags: [a11y, wcag]
---

# Accessibility

- WCAG 2.2 Level AA is the normative target for authored docs and custom docs UI.
- Prefer native elements and native interaction semantics; ARIA must not repair avoidable non-semantic markup.
- Every interactive control is keyboard operable with visible focus.
- Meaning must not depend on color, animation or pointer input alone.
- Respect `prefers-reduced-motion` and Orbz reduced-motion behavior in examples.
- Preserve document language, landmark structure, accessible names and logical heading order.
- Automated accessibility checks are evidence of detected defects, not proof of conformance.
