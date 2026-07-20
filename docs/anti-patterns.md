# Anti-patterns

| Anti-pattern | Why it hurts | Do this instead |
|--------------|--------------|-----------------|
| One giant STATE.md forever | Untrusted sludge; silent truncation | Split work state vs memory tiers |
| Auto-promote everything to durable | Fact poison | Verifier + human gate |
| Vector DB as day-one default | Ops weight before policy | Markdown + git first |
| No confidence tags | Hypotheses become law | `observed` / `decided` / `hypothesis` |
| Unlimited recall | Context death | Retrieval budget |
| Store secrets in memory files | Breach via repo | constraints deny-list + audit penalty |
| Memory without hygiene | Rot | Weekly hygiene loop |
| Silent truncation | Agent thinks it saw everything | Report `dropped_count` |
| Merging fleet audit into memory score | Confuses layers | Separate scores, cross-link |
