# The Hypothesis That Became a Fact

An agent spent an evening on a flaky login test. It wrote one line straight into Durable:

```text
- 2026-10-22T18:04:00Z [hypothesis] retries are safe; the flake is clock skew
```

The next morning a fresh session loaded Durable first and treated the line as policy. It opened PR 441, adding three retries to the login path. The flake was a revoked fixture token. The retries hid it until someone reverted the pull request.

The files are in [examples/morning-after](../examples/morning-after/README.md). Nothing in that folder was installed. `before/` is the file the morning session believed. `after/` is the same project once the note was put back where a hypothesis belongs.

## What the audit said

| Folder | Score | Failures |
|--------|------:|----------|
| `examples/morning-after/before` | 48 | Hypothesis in Durable. No owner, no evidence. |
| `examples/morning-after/after` | 68 | None. The hypothesis is in Scratch. The durable fact names alex and PR 442. |

Both stay at M1. The example is a memory file, not a full set of skills. The full output is [AUDIT.txt](../examples/morning-after/AUDIT.txt).

## What the gate does

From the clone:

```bash
node memory.js promote examples/morning-after/before \
  --apply --to durable --by alex --evidence "a guess" --match "retries are safe"
```

```text
Refused: a hypothesis cannot become durable (retries are safe; the flake is clock skew). Move it back to Scratch.
```

The command exits 1 and does not edit the file. Passing `--by` and `--evidence` does not override the tag.

On the repaired file, `node memory.js promote examples/morning-after/after` is a dry-run. It leaves the hypothesis in Scratch and lists the episodic notes that a person could promote. Durable still requires `--by`, evidence, and `--match`, and it still refuses a hypothesis.

## What belonged in Durable

One decided fact, written by a person after the revert:

```text
fact: Auth fixtures use a static token, refreshed by scripts/refresh-fixture.sh
confidence: decided
owner: alex
evidence: PR 442
```

## Lesson

A hypothesis is allowed in Scratch. It is not allowed to be the thing the next session trusts. The tag is the gate. A name in `--by` does not turn a guess into a fact.
