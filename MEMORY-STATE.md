# Memory State — memory-engineering

Last hygiene: 2026-07-20
Last recall budget check: 2026-07-20

## Scratch (session)

- 2026-07-20 [observed] Scaffolding first public cut of memory-engineering to mirror loop/fleet house style.

## Episodic (recent)

- 2026-07-20 [decided] Created repo scaffold: patterns (5), memory-init, memory-audit, docs, starters.
- 2026-07-20 [observed] Fleet relaunch pack written in sibling fleet-engineering repo; memory is next greenfield growth surface after fleet marketing push.

## Durable facts

- id: stack.order
  fact: Stack order is Context → Harness → Memory → Loop → Fleet
  confidence: decided
  owner: @cobusgreyling
  evidence: README.md
  status: active
  as_of: 2026-07-20
- id: store.default
  fact: Default starter store is markdown + git (no vector DB required)
  confidence: decided
  owner: @cobusgreyling
  evidence: docs/concepts.md
  status: active
  as_of: 2026-07-20
- id: durable.gate
  fact: Durable promotion requires human or verifier gate
  confidence: decided
  owner: @cobusgreyling
  evidence: MEMORY.md
  status: active
  as_of: 2026-07-20


## Noise / ignore

- npm publish timing — track in issues, not durable memory.

## Open questions

- Whether `memory-compact` ships in v0.1 or v0.2.
