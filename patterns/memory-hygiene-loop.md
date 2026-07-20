# Memory Hygiene Loop

**Goal**: Prevent memory rot — stale facts, duplicate episodics, unbounded scratch — on a schedule.

## When to use

- Any project past week one of memory engineering
- Audit warns on size, staleness, or missing owners
- After incidents involving wrong remembered facts

## Tiers

| Tier | Hygiene action |
|------|----------------|
| Scratch | Delete/archive past TTL |
| Episodic | Compact, dedupe, promote invariants |
| Durable | Revalidate evidence; revoke or refresh `as_of` |

## Scheduling

**Recommended**:

- `/loop 1d` light pass (scratch TTL only)
- `/loop 1w` full hygiene (compact + durable review)
- GitHub Action weekly cron for teams

Week one: report-only (propose deletions, do not apply).

## Required skills

- `memory-hygiene` — scan, propose, apply
- `memory-verifier` — approve durable revokes/promotes
- `memory-write` — apply patches

## How the loop runs

1. Scheduler fires.
2. Measure sizes vs `memory-budget.md`.
3. Flag: expired scratch, episodic > N days raw, durable without owner, conflicts.
4. Propose patch list in `MEMORY-STATE.md` → Hygiene proposals.
5. (Phase 2) Auto-apply safe ops: scratch TTL, episodic dedupe.
6. (Phase 3) Human/verifier for durable changes.
7. Append summary to `memory-run-log.md`.

## Post-run critique

- False positive deletions
- Facts that should have been durable
- Budget adjustments for next week

## Verification

- Never delete durable without revoke record
- Keep backup branch or git commit before apply
- `memory-audit` score must not drop more than 10 points silently

## Human handoff

- Durable revokes
- Anything tagged security / compliance
- Contested decisions

## Tool-specific notes

**Grok**

```text
/loop 1w Run memory-hygiene skill. Report-only first. Update memory-run-log.md.
```

**Claude Code**: `$memory-hygiene` with explicit “do not apply durable changes.”

**With loop Daily Triage**: add memory size signals to triage output.

## Failure modes

| Failure | Mitigation |
|---------|------------|
| Aggressive deletion | Report-only week; soft archive |
| Hygiene never run | Audit staleness signal |
| Fight with humans over facts | Require owner ack |
| Costly full-file rewrites | Patch-style edits |

## Cost profile

| Scenario | Tokens |
|----------|--------|
| Light daily | ~10k |
| Weekly full | ~40–80k |

## Scaffold

```bash
node tools/memory-init/cli.js . --pattern memory-hygiene-loop --tool grok
```
