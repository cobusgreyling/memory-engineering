# memory-verifier

## Purpose

Gate durable memory changes and risky promotions.

## When to use

- Before any Durable fact is added, changed, or revoked
- Before promoting episodic → durable

## Checks

1. Confidence is `decided` or verified `observed` — never bare `hypothesis`
2. `owner` present
3. `evidence` present (PR, ADR, path, issue)
4. No secrets (constraints)
5. Conflicts resolved via `supersedes: <id>`
6. Durable count under cap

## Output

- `PASS` + merged entry text, or
- `BLOCK` + reasons

Maker agents must not self-approve durable writes.
