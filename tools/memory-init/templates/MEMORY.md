# Memory Posture

**Pattern**: {{PATTERN}}  
**Tool**: {{TOOL}}  
**Scaffolded**: {{DATE}}

## Intent

Define what agents may remember across sessions, how they write it, and how it is cleaned.

## Tiers

| Tier | Store | Write gate | Recall default |
|------|-------|------------|----------------|
| Scratch | `MEMORY-STATE.md` → Scratch | Agent may write | Current session |
| Episodic | `MEMORY-STATE.md` → Episodic | Agent may append | Last 7 days / budget |
| Durable facts | `MEMORY-STATE.md` → Durable | Human or verifier | Always candidates under budget |
| Retrieved | Computed pack | N/A | Budgeted |

## Write policy

- Append with timestamp + confidence: `observed` | `decided` | `hypothesis`
- Hypotheses never enter Durable without promotion
- Prefer evidence links (PR, issue, path)

## Hygiene

- Cadence: weekly (or when audit warns)
- Skill: `memory-hygiene`
- Pause: set `MEMORY_PAUSE=1` or banner in MEMORY-STATE.md

## Constraints

See `memory-constraints.md`.

## Budget

See `memory-budget.md`.
