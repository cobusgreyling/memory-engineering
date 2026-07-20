# Memory Patterns

Documented, reusable memory patterns for AI coding agents.

Each pattern answers:

- What problem it solves
- Memory tiers involved
- Write / recall / hygiene policy
- Verification and human handoff
- Tool-specific notes (Grok, Claude Code, Codex, Cursor)
- Failure modes and cost profile

## Pattern registry

| Pattern | Cadence | Risk | File |
|---------|---------|------|------|
| Session Scratchpad | per session | Low | [session-scratchpad.md](./session-scratchpad.md) |
| Project Episodic Log | per run / daily | Low | [project-episodic-log.md](./project-episodic-log.md) |
| Durable Facts Store | on decision | Medium | [durable-facts-store.md](./durable-facts-store.md) |
| Retrieval Budget | every recall | Medium | [retrieval-budget.md](./retrieval-budget.md) |
| Memory Hygiene Loop | 1d–1w | Low | [memory-hygiene-loop.md](./memory-hygiene-loop.md) |

Machine index: [registry.yaml](./registry.yaml)

## How to use a pattern

1. Pick a pattern ([pattern-picker](../docs/pattern-picker.md))
2. Scaffold: `node tools/memory-init/cli.js . --pattern <id> --tool grok`
3. Week one: scratch + episodic only (unless you already have durable facts reviewed by a human)
4. Audit: `node tools/memory-audit/cli.js . --suggest`
5. Add hygiene before the state file exceeds budget

## Adding a pattern

Use [templates/pattern-template.md](../templates/pattern-template.md), register in `registry.yaml`, open a PR.
