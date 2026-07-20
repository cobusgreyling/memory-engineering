# AGENTS.md — memory-engineering

## Mission

This repository teaches **memory engineering**: durable, tiered, budgeted memory for AI coding agents. Prefer practical patterns and CLIs over theory.

## Stack alignment

- Inner loops: https://github.com/cobusgreyling/loop-engineering
- Fleet governance: https://github.com/cobusgreyling/fleet-engineering
- Harness runtime: https://github.com/cobusgreyling/harness-foundry

## Working rules

1. Do not invent vector-DB product lock-in as the default path — markdown + git is the universal starter.
2. Every pattern must define write policy, recall policy, hygiene, and failure modes.
3. Durable facts require a gate (human or verifier). Scratch must not auto-promote.
4. Keep `memory-init` and `memory-audit` working without network when run from clone.
5. Dogfood: keep this repo above Memory Ready M1 (`npm run audit:dogfood`).

## Layout

- `patterns/` — stealable patterns
- `templates/` — files scaffolded by `memory-init`
- `tools/memory-init`, `tools/memory-audit` — CLIs
- `docs/` — concepts, score contract, ops
- `starters/` — clone-and-run kits

## Safety

Never store secrets, raw credentials, or production PII in memory files. See `memory-constraints.md` and `docs/anti-patterns.md`.
