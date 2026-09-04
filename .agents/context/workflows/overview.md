# Delivery Workflow Overview

1. Load `AGENTS.md`, scoped context and applicable rules.
2. Determine whether an existing spec owns the behavior.
3. Create/revise a spec before consequential implementation.
4. Implement the smallest observable slice.
5. Collect deterministic evidence in tests/build/audits.
6. Promote durable conclusions to context, rules or ADRs.
7. Review standards and spec fidelity on the same final head.
8. Run `pnpm check` before merge.

Content-only work may have a smaller implementation surface, but it still follows
this evidence model when it changes public meaning, IA, SEO or accessibility.
