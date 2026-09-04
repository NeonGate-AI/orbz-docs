---
version: 1
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
