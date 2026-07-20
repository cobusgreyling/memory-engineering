# Project Episodic Log

**Goal**: Remember *what happened* across days — decisions, incidents, handoffs — without claiming eternal truth.

## When to use

- Loop runs that need continuity (`STATE.md` alone loses narrative)
- Team handoffs between humans and agents
- Postmortems and “why did we do that?”

## Tiers

| Tier | Role |
|------|------|
| **Episodic** | Primary |
| Scratch | Feed-in during session |
| Durable | Only extracted invariants |

## Scheduling

- Append after every meaningful agent run or human decision
- Daily triage loop may summarize last 24h into one episodic block
- Compact weekly under retrieval budget

## Required skills

- `memory-write` — append episodic with `who / what / why / evidence`
- `memory-recall` — time-bounded fetch (e.g. last 7d)
- `memory-hygiene` — compact and drop noise

## State shape

```markdown
## Episodic (recent)
- 2026-07-18 — [decided] Keep markdown memory as default store (PR #12). Evidence: portability.
- 2026-07-19 — [observed] fleet-audit false negative on empty manifests. Fix: count templates.
```

## How it runs

1. Run completes → write 1–5 episodic bullets (not a diary).
2. Link evidence: PR, commit, issue, log path.
3. On recall: prefer last N days, then keyword hit, under token budget.
4. Weekly: hygiene skill merges duplicates and moves invariants to promote queue.

## Verification

- Every `[decided]` entry needs owner or PR link
- Episodic must not silently rewrite history — append or explicit amend note
- Size: if episodic section > budget, fail audit until compacted

## Human handoff

- Ambiguous decisions stay episodic until a human marks durable
- Incident writeups stay episodic; only remediation rules promote

## Tool-specific notes

**With loop-engineering**: after Daily Triage, append episodic “what changed in state.”

**Grok `/loop 1d`**: hygiene + episodic compact job.

## Failure modes

| Failure | Mitigation |
|---------|------------|
| Novel-length logs | Bullet template; max lines/run |
| Missing evidence | Schema require link or path |
| Conflicting decisions | Keep both + supersedes: field |
| Token blowups on recall | Retrieval budget pattern |

## Cost profile

| Scenario | Tokens |
|----------|--------|
| Append-only write | ~1k |
| 7-day recall | ~5–15k |
| Weekly compact | ~20–40k |

## Scaffold

```bash
node tools/memory-init/cli.js . --pattern project-episodic-log --tool grok
```
