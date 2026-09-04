# Web Performance Engineering Notes

This context record captures performance principles useful for Orbz Docs. It is
not a substitute for measurement and it does not assign synthetic ranking value
to performance work.

## Principles

- Optimize user-visible outcomes, not a single lab score.
- Measure before and after consequential performance changes.
- Prefer less JavaScript over faster JavaScript when content can stay static.
- Make important content discoverable in initial HTML.
- Reserve layout space for media and dynamic UI to protect CLS.
- Treat third-party scripts as explicit performance dependencies.
- Diagnose LCP by discovery, server time, resource load and render delay rather
  than guessing from asset size alone.
- Diagnose INP through actual interaction latency and long tasks; TBT is only a
  lab proxy and must not be reported as INP.
- Validate mobile constraints because documentation traffic often includes
  constrained CPUs and networks.

## Nextra-specific bias

The default posture is static MDX + Server Components. Introduce Client
Components only for interaction that cannot be expressed by the platform/Nextra
shell. Keep global layout logic small because it affects every route.

## Evidence

Use `.agents/context/web-quality.md` evidence labels. Field p75 data is the
source for production Core Web Vitals status. Lab tools are used to reproduce
and localize regressions, not to claim field success.
