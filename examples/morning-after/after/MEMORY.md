# Memory Posture — auth fixture (after)

## Tiers

| Tier | Write gate |
|------|------------|
| Scratch | Agent may append |
| Episodic | Agent may append observed or decided notes |
| Durable facts | Human or verifier only |

## Write policy

- Timestamp + confidence: `observed`, `decided`, or `hypothesis`
- A hypothesis stays in Scratch
