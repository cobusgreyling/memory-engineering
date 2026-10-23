# CLI surface

## memory.js

Front door. No install.

```bash
node memory.js init [path] [--pattern id] [--tool grok|claude|codex|cursor] [--force]
node memory.js write [path] "note" [--tag hypothesis|observed|decided]
node memory.js promote [path] [--apply] [--to episodic|durable] [--by name] [--evidence text] [--match words]
node memory.js audit [path] [--suggest] [--json] [--min-score=N]
```

`promote` without `--apply` prints the queue and does not edit `MEMORY-STATE.md`.

## memory-init

Scaffold memory engineering artifacts into a target directory.

```bash
node tools/memory-init/cli.js [path] [options]

Options:
  --pattern <id>   session-scratchpad (default) | project-episodic-log |
                   durable-facts-store | retrieval-budget | memory-hygiene-loop
  --tool <name>    grok | claude | codex | cursor  (default: grok)
  --with-loop      also remind to run loop-init (prints command)
  --force          overwrite existing templates
  --help
```

**Exit codes:** 0 success · 1 usage error · 2 target not writable

Prefer `node memory.js init`. The same scaffold is `node tools/memory-init/cli.js`.

## memory-audit

Compute Memory Ready score.

```bash
node tools/memory-audit/cli.js [path] [options]

Options:
  --json           machine output
  --suggest        print fix commands for gaps
  --min-score=N    exit 1 if score < N
  --help
```

**Exit codes:** 0 ok · 1 below min-score · 2 score < 40 (soft fail when no min-score)

Prefer `node memory.js audit`. The same score is `node tools/memory-audit/cli.js`.

## memory-promote

The promotion gate.

- Scratch → Episodic: `observed` and `decided` only, at most 3 per run
- Episodic → Durable: `--by` plus evidence, and the note's tag is not `hypothesis`
- A hypothesis already sitting in Durable is reported and refused
- `write` refuses notes that look like secrets

```bash
node memory.js promote .
node memory.js promote . --apply --to episodic
node memory.js promote . --apply --to durable --by "Your Name" --evidence "PR 442" --match "static token"
```

Library: `tools/memory-promote/promote.js`.

## Planned

| CLI | Job |
|-----|-----|
| `memory-compact` | Summarize episodic under budget |
| `memory-pack` | Emit recall pack JSON for harnesses |
| `memory-mcp-server` | MCP: recall, write, list, hygiene |

## Composition with loop / fleet

```bash
# Loop work spine + memory spine
npx @cobusgreyling/loop-init . --pattern daily-triage
node memory.js init . --pattern project-episodic-log

# Fleet later: per-agent memory namespaces under agents/<id>/MEMORY-STATE.md
```
