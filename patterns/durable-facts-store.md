# Durable Facts Store

**Goal**: Keep a small, high-trust set of project facts agents may rely on without re-deriving every session.

## When to use

- Architecture invariants (“we use Postgres, not MySQL”)
- Owners, SLAs, non-goals
- Safety rules that must survive session resets

## Tiers

| Tier | Role |
|------|------|
| **Durable** | Primary |
| Episodic | Provenance / history of the decision |
| Scratch | Never |

## Scheduling

- Write only on explicit decision events (ADR, PR merge, human approve)
- Review quarterly or when audit flags stale facts
- Revoke by marking `status: revoked` — do not silent-delete without note

## Required skills

- `memory-write` — propose durable entry (draft only)
- `memory-verifier` — **required** gate
- `memory-recall` — always include durable candidates first under budget

## State shape

```markdown
## Durable facts
- id: stack.db
  fact: Primary database is PostgreSQL 16
  confidence: decided
  owner: @platform
  evidence: ADR-0004
  status: active
  as_of: 2026-06-01
```

## How it runs

1. Something becomes “true for the project.”
2. Agent or human drafts durable entry in a promote queue.
3. Verifier checks: evidence present, not secret, not hypothesis, no conflict.
4. Human or policy merges into Durable.
5. Recall always loads active durable facts (subject to budget priority).

## Verification strategy

- No durable write without `evidence` + `owner`
- `hypothesis` confidence **rejected**
- Conflicts: new fact must `supersedes: <id>`
- Optional CI: `memory-audit` fails if durable section lacks owners

## Human handoff

- Default: human merge for first 30 days
- Later: allow verifier auto-merge only for low-risk namespaces (`style.*`, `tooling.*`)

## Tool-specific notes

**Claude Code / Cursor**: durable facts in `MEMORY-STATE.md` + mirror one-liners in `AGENTS.md` if short.

**Pair with outerloop**: durable facts can be evidence-backed verdicts.

## Failure modes

| Failure | Mitigation |
|---------|------------|
| Fact rot | `as_of` + quarterly hygiene |
| Over-durable noise | Hard cap (e.g. 50 facts) |
| Secret leakage | constraints deny-list |
| Agent overwrites | file ownership + verifier |

## Cost profile

| Scenario | Tokens |
|----------|--------|
| Load all durable | ~1–4k if kept small |
| Promote review | ~5–10k |

**Cap**: prefer 25–50 active facts. If more, namespace and retrieve.

## Scaffold

```bash
node tools/memory-init/cli.js . --pattern durable-facts-store --tool grok
```
