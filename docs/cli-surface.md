# CLI surface

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

**Planned npm:** `npx @cobusgreyling/memory-init`

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

**Planned npm:** `npx @cobusgreyling/memory-audit`

## Planned (not in v0 scaffold)

| CLI | Job |
|-----|-----|
| `memory-compact` | Summarize episodic under budget |
| `memory-promote` | Interactive/CI promote queue |
| `memory-pack` | Emit recall pack JSON for harnesses |
| `memory-mcp-server` | MCP: recall, write, list, hygiene |

## Composition with loop / fleet

```bash
# Loop work spine + memory spine
npx @cobusgreyling/loop-init . --pattern daily-triage
node tools/memory-init/cli.js . --pattern project-episodic-log

# Fleet later: per-agent memory namespaces under agents/<id>/MEMORY-STATE.md
```
