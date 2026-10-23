# Morning after

A hypothesis was written into Durable. The next session believed it. This folder is the before and the after. Nothing here needs to be installed.

## Read these two files

| | File | What happened |
|--|------|----------------|
| Before | [before/MEMORY-STATE.md](before/MEMORY-STATE.md) | `[hypothesis] retries are safe` sits under Durable |
| After | [after/MEMORY-STATE.md](after/MEMORY-STATE.md) | The hypothesis is back in Scratch. One decided fact has an owner and evidence |

The story is [stories/poisoned-durable-fact.md](../../stories/poisoned-durable-fact.md). Scores from `memory audit` are in [AUDIT.txt](AUDIT.txt).

## Run it

From the clone:

```bash
node memory.js audit examples/morning-after/before
node memory.js promote examples/morning-after/before --apply --to durable --by alex --evidence "a guess" --match "retries are safe"
node memory.js audit examples/morning-after/after
node memory.js promote examples/morning-after/after
```

The audit of `before` exits 1: Durable holds a hypothesis and names no owner. The promote command exits 1 and prints the refusal. The audit of `after` exits 0. Its promote is a dry-run: it prints the queue and does not edit the file.
