# Quickstart — 5 minutes to Memory Ready

## 1. Scaffold

From this repo:

```bash
node tools/memory-init/cli.js /path/to/your-project --pattern session-scratchpad --tool grok
```

Patterns: `session-scratchpad` | `project-episodic-log` | `durable-facts-store` | `retrieval-budget` | `memory-hygiene-loop`

Tools: `grok` | `claude` | `codex` | `cursor`

## 2. Audit

```bash
node tools/memory-audit/cli.js /path/to/your-project --suggest
```

Climb toward **M1 (≥40)** before enabling any auto-promotion to durable facts.

## 3. First session ritual

1. Read `MEMORY-STATE.md` Scratch + Durable only
2. Work
3. Append scratch bullets with `[observed]` / `[hypothesis]` / `[decided]`
4. Propose ≤3 episodic promotions at end of day
5. Do **not** edit Durable without a human

## 4. Week two

Add hygiene:

```bash
node tools/memory-init/cli.js . --pattern memory-hygiene-loop
```

Wire a weekly loop (Grok `/loop 1w`, Claude scheduler, or GitHub Action).

## 5. Optional: pair with loop-engineering

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage
# keep MEMORY-STATE.md as the memory spine; STATE.md as the work spine
```

See [with-loop.md](./with-loop.md).
