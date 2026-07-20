# memory-write

## Purpose

Append structured memory entries to `MEMORY-STATE.md` without poisoning durable facts.

## When to use

- End of a work segment or agent run
- Capturing observations, decisions, or hypotheses

## Instructions

1. Read `memory-constraints.md`. Abort if content is forbidden.
2. If `MEMORY_PAUSE=1` or MEMORY-STATE is marked PAUSED, do not write.
3. Choose tier:
   - Scratch: session-only working notes
   - Episodic: what happened / decided with evidence
   - Durable: **draft to Hygiene proposals only** — never direct write unless human/verifier approved
4. Format:
   `- ISO-TIME [observed|decided|hypothesis] text (evidence: …)`
5. Keep bullets short; no essays.
6. Append a line to `memory-run-log.md`.

## Non-goals

- Do not rewrite history silently
- Do not store secrets
