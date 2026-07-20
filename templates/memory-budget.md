# Memory Budget

## Recall caps

- max_tokens_total: 4000
- max_tokens_durable: 1500
- max_tokens_scratch: 800
- max_tokens_episodic: 2000
- max_episodic_days: 7
- max_entries: 40

## Store size alerts

- scratch_max_lines: 80
- episodic_max_lines: 200
- durable_max_facts: 50

## Ops token budget (memory skills only)

- daily_cap_tokens: 30000
- weekly_hygiene_cap_tokens: 80000

## Priority on recall

1. Durable (active)
2. Scratch (if session active)
3. Episodic (newest first, keyword boost)
