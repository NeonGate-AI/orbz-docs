---
name: grilling
description: Stress-test a proposed Docs change when requested, resolving consequential decisions through evidence before interviewing.
---

# Grilling

Map the decision tree for the requested change: public behavior, ownership,
credentials and data, accessibility, layout, failure states, evidence and delivery.
Inspect repository facts yourself and delegate independent factual questions.

Separate settled owner decisions from unresolved decisions. Preserve explicit
constraints and authorization already provided in the session. Record reasonable
reversible implementation assumptions in the active spec. If all consequential
branches are settled, state that finding and continue the authorized workflow.

If a material decision remains unresolved, ask the smallest useful question with
its effect and a recommendation. Questions depending on an unanswered decision
wait for the next round. Use `grill-me` only when the owner asks for an interview
or the unresolved decision prevents faithful implementation. Do not ask the owner
for facts available from the repository.

Completion: every consequential branch is resolved or explicitly deferred;
required behavior and assumptions are recorded in the numbered spec. A score or
confidence percentage never replaces this check.
