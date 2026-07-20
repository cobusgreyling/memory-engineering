# Concepts

## Memory engineering vs related layers

| Discipline | Question |
|------------|----------|
| Context engineering | What fits in *this* prompt? |
| Harness engineering | How does one run execute safely? |
| **Memory engineering** | What is true *across* runs, and who may write it? |
| Loop engineering | What system keeps re-prompting and verifying? |
| Fleet engineering | How do many agents share governance? |

Memory is not “more context.” Memory is **state with policy**: tiers, gates, budgets, hygiene.

## The four tiers

1. **Scratch** — session working memory; high churn, low trust
2. **Episodic** — narrative of what happened; medium trust
3. **Durable facts** — small high-trust invariants; gated writes
4. **Retrieved** — computed pack for one inference under budget

## Confidence tags

| Tag | Meaning | Can be durable? |
|-----|---------|-----------------|
| `observed` | Agent saw evidence | After verify |
| `decided` | Human/process decision | Yes |
| `hypothesis` | Guess | Never |

## Promotion

```
scratch  --(session end)-->  episodic  --(verifier/human)-->  durable
```

Skipping gates is an anti-pattern (see [anti-patterns.md](./anti-patterns.md)).

## Stores

**Default:** markdown files in git (`MEMORY.md`, `MEMORY-STATE.md`).

Optional later: vector DB, Mem0, team wiki — behind the same tier policy. Patterns stay store-agnostic.

## Relationship to STATE.md (loops)

| File | Job |
|------|-----|
| `STATE.md` | What the *loop* is working on now |
| `MEMORY-STATE.md` | What the *project/agent* should remember across time |

Do not merge them into one infinite document.
