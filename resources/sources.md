# Sources

## Primary stack (this author)

- [Loop Engineering](https://github.com/cobusgreyling/loop-engineering) — design systems that prompt agents over time
- [Fleet Engineering](https://github.com/cobusgreyling/fleet-engineering) — govern populations of agents
- [Harness Foundry](https://github.com/cobusgreyling/harness-foundry) — composable harness runtime
- [Outerloop](https://github.com/cobusgreyling/outerloop) — evidence → verdict → answerability

## Where the distinction comes from

Memory engineering, in this repo, is the write path and the promotion policy. Context engineering is the read path: what fits in this window. These sources name the same split in their own words.

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic. Context engineering curates the window. The section on structured note-taking describes agentic memory as notes kept outside that window.
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al. The model pages information between in-context memory and external storage. Letta's docs still call the practice memory management: [Memory overview](https://docs.letta.com/guides/agents/memory).
- [Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/abs/2309.02427) — Sumers et al. Working, episodic, semantic, and procedural memory. This repo uses a smaller ladder: scratch, episodic, durable, retrieved.
- [Context vs Memory vs Harness Engineering](https://beam.ai/agentic-insights/context-memory-harness-engineering) — a practitioner split of the three names. Memory engineering is what the agent knows across time.

The phrase is a practical label. The research literature more often says agent memory or memory management. This repo keeps the label because it is the layer between a harness and a loop: what is allowed to be true on the next run.

## How this repo relates

Turn "agents need memory" from a product claim into patterns, a memory test, and three commands: `init`, `write`, `promote`, plus `audit`.
