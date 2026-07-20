# Memory Posture — memory-engineering (reference repo)

## Intent

This repo dogfoods memory engineering so contributors and agents share a durable picture of decisions, tiers, and constraints.

## Tiers in use

| Tier | Store | Write gate | Recall default |
|------|-------|------------|----------------|
| Scratch | `MEMORY-STATE.md` → Scratch | Agent may write | Current session only |
| Episodic | `MEMORY-STATE.md` → Episodic + `memory-run-log.md` | Agent may append | Last 7 days / budget |
| Durable facts | `MEMORY-STATE.md` → Durable | Human or verifier | Always candidates under budget |
| Retrieved | N/A (computed) | N/A | Max N chunks / tokens |

## Write policy

- Prefer append + timestamp over silent rewrite.
- Mark confidence: `observed` | `decided` | `hypothesis`.
- Hypotheses never enter Durable without promotion.

## Hygiene

- Cadence: weekly or when `memory-audit` warns on size.
- Pattern: [memory-hygiene-loop](patterns/memory-hygiene-loop.md)
- Kill switch: set `MEMORY_PAUSE=1` or note pause in MEMORY-STATE.md.

## Constraints

See [memory-constraints.md](memory-constraints.md).

## Budget

See [memory-budget.md](memory-budget.md).
