# Memory State — auth fixture (after)

Last hygiene: 2026-10-23
Last recall budget check: 2026-10-23

## Scratch (session)

- 2026-10-22T18:04:00Z [hypothesis] retries are safe; the flake is clock skew

## Episodic (recent)

- 2026-10-22T17:40:00Z [observed] login test failed twice on CI job 8841
- 2026-10-22T19:10:00Z [observed] opened PR 441 adding three retries to login (evidence: PR 441)
- 2026-10-23T09:05:00Z [decided] reverted PR 441; the flake was a revoked fixture token (evidence: PR 442)

## Durable facts

- id: auth.fixture-token
  fact: Auth fixtures use a static token, refreshed by scripts/refresh-fixture.sh
  confidence: decided
  owner: alex
  evidence: PR 442
  status: active
  as_of: 2026-10-23

## Noise / ignore

- Clock-skew theory. The fixture token had been revoked.

## Open questions

_None yet._
