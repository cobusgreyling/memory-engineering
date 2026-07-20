# Pattern picker

Answer in order; stop at first match.

1. **Agent forgets in-progress work within a day?** → [session-scratchpad](../patterns/session-scratchpad.md)
2. **Team argues about past decisions?** → [project-episodic-log](../patterns/project-episodic-log.md)
3. **Need invariants agents must not re-litigate?** → [durable-facts-store](../patterns/durable-facts-store.md)
4. **Context window full of history?** → [retrieval-budget](../patterns/retrieval-budget.md)
5. **Memory file rotting / huge?** → [memory-hygiene-loop](../patterns/memory-hygiene-loop.md)

Default greenfield path:

```text
session-scratchpad → project-episodic-log → retrieval-budget → memory-hygiene-loop → durable-facts-store
```
