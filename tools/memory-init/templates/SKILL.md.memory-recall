# memory-recall

## Purpose

Build a budgeted memory pack for the current task.

## When to use

- Start of session
- Before planning or multi-step agent work
- When user asks “what do we know about X?”

## Instructions

1. Read `memory-budget.md` caps.
2. Load active Durable facts first (up to durable token cap).
3. Load Scratch if this is a continuing session.
4. Fill remainder with Episodic (newest first; keyword filter if task given).
5. Never exceed `max_tokens_total`.
6. Report `dropped_count` if anything omitted.
7. Do not invent facts not present in stores.

## Output shape

```markdown
## Memory pack
### Durable
- …
### Scratch
- …
### Episodic
- …
dropped_count: N
```
