# The Memory Test

The check that separates engineered memory from a long note the agent will believe tomorrow.

For every fact an agent may reload, answer:

> **When was it written, at what confidence, owned by whom, evidenced by what, promoted by whom, under what budget, and is it allowed to be stored?**

If any clause is blank, leave it in Scratch.

## When was it written?

A timestamp on the bullet or `as_of` on a durable fact.

**Blank:** "We decided this a while ago."
**Filled:** `2026-10-23T09:05:00Z`.

## What confidence?

One of `observed`, `decided`, or `hypothesis`.

**Blank:** A sentence with no tag, written as if it were true.
**Filled:** `[hypothesis] retries are safe; the flake is clock skew`.

A hypothesis may sit in Scratch. It is never a durable fact.

## Who owns it?

A person or role on every durable fact.

**Blank:** The file says "the agent remembers."
**Filled:** `owner: alex`.

## Evidenced by what?

A path, pull request, issue, or log the next session can open.

**Blank:** "It seemed right last night."
**Filled:** `evidence: PR 442`.

## Who may promote it?

Scratch can be appended by the agent. Episodic accepts `observed` and `decided` notes, at most three per promote run. Durable accepts a note only when `--by` names a person or a verifier, the note is not a hypothesis, and evidence is present.

**Blank:** The agent edits the Durable section directly.
**Filled:** `node memory.js promote . --apply --to durable --by "alex" --evidence "PR 442" --match "static token"`.

## What is the retrieval budget?

Caps in `memory-budget.md` for scratch, episodic, and durable recall. A correct fact is still the wrong thing to load when it blows the window.

**Blank:** The whole history goes back into the next prompt.
**Filled:** Scratch 2000 tokens, episodic 1500, durable 800.

## What must never be stored?

`memory-constraints.md` lists secrets, raw customer data, and anything else this project refuses to remember.

**Blank:** Tokens copied into `MEMORY-STATE.md` because they were on screen.
**Filled:** A constraints file, and `node memory.js write` refusing a note that looks like a secret.

## Fifteen-minute walkthrough

1. Open `MEMORY-STATE.md`.
2. Pick one durable fact and one scratch bullet.
3. Score each clause above.
4. Run:

```bash
node memory.js audit .
node memory.js promote .
```

`memory-audit` fails the run when Durable holds a `[hypothesis]` or `confidence: hypothesis`. `memory promote` refuses to move a hypothesis into Durable.

The worked case is [examples/morning-after](../examples/morning-after/README.md).
