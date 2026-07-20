# Memory Ready Score

Public contract for `memory-audit`.

Same ritual as Loop Ready / Fleet Ready:

```bash
node tools/memory-audit/cli.js . --suggest
# later: npx @cobusgreyling/memory-audit . --suggest
```

## Levels

| Level | Score | Meaning | Safe behavior |
|-------|-------|---------|---------------|
| **M0** | 0–39 | Ad-hoc memory | Chat history only; no shared policy |
| **M1** | 40–64 | Structured | Scratch + episodic files; no auto durable |
| **M2** | 65–84 | Budgeted | Recall caps + hygiene loop |
| **M3** | 85–100 | Gated durable | Verifier/human promotion + CI dogfood |

CI examples:

```bash
node tools/memory-audit/cli.js . --min-score=40   # M1
node tools/memory-audit/cli.js . --min-score=65   # M2
```

## Weights (v0)

Base **10**.

| Signal | Points |
|--------|--------|
| `MEMORY.md` posture | +16 |
| `MEMORY-STATE.md` | +14 |
| Tiers documented in MEMORY.md | +8 |
| `memory-write` skill | +8 |
| `memory-recall` skill | +8 |
| `memory-hygiene` skill | +8 |
| `memory-verifier` skill | +8 |
| `memory-budget.md` | +10 |
| `memory-constraints.md` | +6 |
| `memory-run-log.md` | +4 |
| Confidence tags in use | +4 |
| GitHub audit workflow | +4 |
| Patterns registry present | +2 |

Penalties:

| Issue | Penalty |
|-------|---------|
| Durable section without any owner/evidence hints | −8 |
| Memory files mention secrets patterns | −15 |
| STATE.md > 100KB with no MEMORY split | −5 |

## Human output template

```
Memory Ready: 47/100  ·  M1 structured

OK
  MEMORY.md present
  MEMORY-STATE.md present
  memory-write skill
  memory-recall skill

WARN
  Missing memory-budget.md
  Missing memory-hygiene skill

Suggested actions
  node tools/memory-init/cli.js . --pattern retrieval-budget
  node tools/memory-init/cli.js . --pattern memory-hygiene-loop
```

## Climb path

1. `memory-init --pattern session-scratchpad` → ~M1
2. Add episodic + budget → mid M1 / low M2
3. Hygiene loop + verifier → M2
4. Durable store with gates + CI → M3
