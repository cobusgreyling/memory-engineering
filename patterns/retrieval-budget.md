# Retrieval Budget

**Goal**: Stop memory from eating the context window. Every recall has a hard budget and a priority order.

## When to use

- Episodic logs grew past a few screenfuls
- Agents load entire `STATE.md` / chat history every turn
- Multi-repo or multi-agent setups sharing memory packs

## Tiers

Applies to **all** tiers at recall time:

1. Durable (highest priority)
2. Scratch (if same session)
3. Episodic (time-decay)
4. Optional vector/keyword hits (lowest)

## Scheduling

- Enforced on **every** recall
- Budget numbers live in `memory-budget.md`
- Audit fails if no budget file at M2+

## Required skills

- `memory-recall` — must accept `--budget-tokens` / respect file
- `memory-hygiene` — keeps stores within compact thresholds

## Budget shape

```markdown
# memory-budget.md
## Recall caps
- max_tokens_total: 4000
- max_tokens_durable: 1500
- max_tokens_scratch: 800
- max_tokens_episodic: 2000
- max_episodic_days: 7
- max_entries: 40
```

## How it runs

1. Recall requested with task hint (optional keywords).
2. Pack durable first until sub-cap.
3. Add scratch if session active.
4. Fill remainder with episodic (newest first, keyword boost).
5. Emit pack + `dropped_count` so agent knows what it did not see.
6. Log recall size to `memory-run-log.md`.

## Verification

- Packer must never exceed `max_tokens_total`
- Must report omissions (silent truncation = fail)
- Unit tests on packer with fixtures

## Human handoff

- If critical facts keep dropping, raise durable cap or split namespaces
- Cost spikes → lower episodic days

## Tool-specific notes

**loop-context**: align memory recall caps with loop token budgets.

**Claude Code**: skill preamble “load memory pack ≤4k tokens.”

## Failure modes

| Failure | Mitigation |
|---------|------------|
| Silent truncation | Require dropped_count |
| Durable starved by episodic | Priority order fixed |
| Keyword miss | Hybrid: recency + keyword |
| Budget file ignored | audit signal + CI |

## Cost profile

Recall cost ≈ pack size. Cap is the point.

## Scaffold

```bash
node tools/memory-init/cli.js . --pattern retrieval-budget --tool grok
```
