# Operating Memory in Production

## Budgeting

Estimate before scheduling hygiene or heavy recall:

- Light scratch load: ~2k tokens
- Daily episodic append: ~1–5k
- Weekly hygiene: ~40–80k

Track in `memory-budget.md` and `memory-run-log.md`.

## Logging

Append one line per memory op:

```markdown
| ts | op | tokens | notes |
|----|----|--------|-------|
| 2026-07-20T12:00Z | recall | 2.1k | durable+scratch |
| 2026-07-20T18:00Z | hygiene | 45k | report-only |
```

## Pause / kill

- Env: `MEMORY_PAUSE=1` → skills no-op writes
- Or banner at top of `MEMORY-STATE.md`: `PAUSED: human freeze`

## Metrics that matter

| Metric | Healthy |
|--------|---------|
| Memory Ready score | ≥40 after week 1 |
| Durable fact count | 10–50 active |
| Recall pack tokens p95 | under budget |
| Hygiene last run | < 14 days |
| Wrong-fact incidents | trending down |

## When to stop

If agents ignore memory files, fix recall skill wiring — do not grow the store.
