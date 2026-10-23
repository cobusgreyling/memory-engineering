# Memory + Loop (+ Fleet)

## With loop-engineering

| Loop file | Memory file |
|-----------|-------------|
| `LOOP.md` | `MEMORY.md` |
| `STATE.md` | `MEMORY-STATE.md` |
| `loop-budget.md` | `memory-budget.md` |
| `loop-run-log.md` | `memory-run-log.md` |

**Rule:** loops decide *what to do next*; memory decides *what remains true*.

Example Daily Triage addition:

```text
After triage, append 1–3 episodic bullets for decisions and incidents.
Do not dump the full STATE into memory.
```

Scaffold both:

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
node /path/to/memory-engineering/memory.js init . --pattern project-episodic-log --tool grok
```

## With fleet-engineering

- Shared durable facts: team-level `MEMORY-STATE.md` or wiki export
- Per-agent scratch: `agents/<id>/scratch.md`
- Fleet audit does **not** replace memory-audit — run both

## With harness-foundry / outerloop

- Emit memory write events into traces
- Durable promotions can require outerloop verdict evidence
