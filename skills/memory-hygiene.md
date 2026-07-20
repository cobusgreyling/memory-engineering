# memory-hygiene

## Purpose

Keep memory stores small, fresh, and trustworthy.

## When to use

- Scheduled weekly loop
- When `memory-audit` warns on size/staleness
- After incidents involving wrong facts

## Instructions

1. Measure section sizes vs `memory-budget.md`.
2. Propose:
   - Delete/archive scratch past TTL (24–48h)
   - Dedupe episodic
   - Flag durable without owner/evidence
3. Default mode: **report-only** (write proposals under Hygiene proposals).
4. Apply safe ops only when user/loop policy allows (scratch TTL, episodic dedupe).
5. Durable revoke/promote always needs verifier or human.
6. Log outcome in `memory-run-log.md`.
