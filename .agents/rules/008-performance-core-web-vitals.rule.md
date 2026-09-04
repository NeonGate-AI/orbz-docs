---
version: 2
name: Performance and Core Web Vitals
description: Rendering and evidence constraints for fast documentation.
alwaysApply: true
priority: high
tags: [performance, cwv]
---

# Performance and Core Web Vitals

- Default to static MDX and Server Components; client JavaScript needs an interaction justification.
- Reserve dimensions/space for media and dynamic elements that can shift layout.
- Avoid adding global third-party scripts without a measured requirement and performance review.
- Optimize the likely LCP path before micro-optimizing below-the-fold content.
- Production CWV status is based on representative p75 field data: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
- Lighthouse/TBT are diagnostic lab evidence; TBT must never be reported as measured INP.
- Performance changes state the measurement scope and evidence class.
- Preserve static generation/CDN cacheability unless a measured requirement justifies request-time rendering.
- Security hardening must account for performance trade-offs; a nonce CSP that forces all docs dynamic requires an explicit architecture change.
- Client Component count and third-party/embed additions are performance budgets, not incidental implementation details.
