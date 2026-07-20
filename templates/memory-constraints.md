# Memory Constraints

## Never store

- API keys, tokens, passwords, private keys
- Production secrets or connection strings
- Raw customer PII / credentials from tickets
- Full dump of proprietary datasets

## Write limits

- No silent rewrite of Durable facts — use revoke + supersedes
- No promotion of `hypothesis` to Durable
- No auto-delete of Durable without revoke record

## Tool scope

- memory-write: may edit MEMORY-STATE.md sections Scratch/Episodic
- durable edits: verifier or human only
- MEMORY_PAUSE=1: all writers no-op
