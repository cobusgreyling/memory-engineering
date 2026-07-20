# Session Scratchpad

**Goal**: Capture working notes for *this* agent session without polluting durable project memory.

## When to use

- Multi-hour coding sessions with interruptions
- Exploratory debugging where hypotheses change fast
- Any time the agent would otherwise re-derive the same temporary context

## Tiers

| Tier | Role |
|------|------|
| **Scratch** | Primary store |
| Episodic | Optional end-of-session promote of *decisions only* |
| Durable | Never direct from scratch |

## Scheduling

- Start of session: load scratch section (or wipe if stale > 24h and unmarked)
- During session: append freely
- End of session: promote 0–3 items to episodic; clear or archive rest

## Required skills

- `memory-write` — append scratch with timestamp + confidence
- `memory-recall` — load scratch first, then episodic if needed
- `memory-verifier` (optional) — blocks accidental durable writes

## State shape

```markdown
## Scratch (session)
- 2026-07-20T10:12Z [hypothesis] auth flake may be clock skew
- 2026-07-20T11:01Z [observed] fails only on Node 20.11
```

## How it runs

1. Session opens → recall scratch (cap: 2k tokens).
2. Agent works; writes short bullets only (no essays).
3. Session ends → agent proposes promotions; human or policy accepts episodic only.
4. Scratch older than TTL (default 24–48h) is archived or deleted.

## Verification

- Scratch entries must include timestamp + confidence tag
- No secrets (scan against `memory-constraints.md`)
- Durable section unchanged unless explicit promote flow

## Human handoff

- End-of-day: skim promotions list
- Reject hypotheses that never confirmed

## Tool-specific notes

**Grok / Claude Code / Cursor**

```text
At session start: read MEMORY-STATE.md Scratch only.
During work: append short [observed|hypothesis] bullets.
Do not edit Durable facts.
At session end: propose ≤3 episodic promotions.
```

**Codex Automations**: end-of-day job that only archives scratch > TTL.

## Failure modes

| Failure | Mitigation |
|---------|------------|
| Scratch becomes second STATE novel | Bullet max length; budget cap |
| Hypotheses treated as facts | Confidence tags + verifier |
| Never cleared | TTL + hygiene loop |
| Secrets pasted | constraints deny-list |

## Cost profile

| Scenario | Tokens |
|----------|--------|
| Load scratch | ~0.5–2k |
| End-of-session promote review | ~3–8k |

**Suggested daily cap**: 30k tokens for memory ops (separate from coding).

## Scaffold

```bash
node tools/memory-init/cli.js . --pattern session-scratchpad --tool grok
```
