# Quickstart — four commands

From this clone. No install.

```bash
node memory.js init /path/to/your-project
node memory.js write /path/to/your-project "what you learned" --tag hypothesis
node memory.js promote /path/to/your-project
node memory.js audit /path/to/your-project --suggest
```

`write` defaults to `hypothesis`. Pass `--tag observed` or `--tag decided` when the note earned it.

Promote is a dry-run until you apply it:

```bash
node memory.js promote /path/to/your-project --apply --to episodic
node memory.js promote /path/to/your-project --apply --to durable --by "Your Name" --evidence "PR or path" --match "words"
```

Episodic takes at most three `observed` or `decided` notes per run. A hypothesis stays in Scratch. Durable requires `--by` and evidence.

Patterns for `init`: `session-scratchpad` (default) | `project-episodic-log` | `durable-facts-store` | `retrieval-budget` | `memory-hygiene-loop`

Tools: `grok` (default) | `claude` | `codex` | `cursor`

```bash
node memory.js init /path/to/your-project --pattern session-scratchpad --tool grok
```

Climb to **M1 (score at least 40)** before any durable promotion. Week two, add hygiene:

```bash
node memory.js init /path/to/your-project --pattern memory-hygiene-loop
```

The pass/fail list is [the memory test](memory-test.md). A finished before/after is [examples/morning-after](../examples/morning-after/README.md).

## With loop-engineering

`STATE.md` stays the work spine. `MEMORY-STATE.md` stays the memory spine. See [with-loop.md](with-loop.md).
