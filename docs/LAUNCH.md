# Memory Engineering — Launch Playbook

Ship **after** fleet relaunch week (or in parallel only if you have bandwidth). Same viral mechanics as loop.

## Positioning

> Stop re-explaining the repo. Design the memory. Get a score.

| | Loop | Memory |
|--|------|--------|
| Pain | Re-prompting | Re-explaining / amnesia |
| Score | Loop Ready | Memory Ready |
| Day-one command | `loop-init` | `memory-init` |

## Pre-launch checklist

- [ ] `npm run test:tools` green
- [ ] Dogfood score ≥ 40 (`node tools/memory-audit/cli.js .`)
- [ ] npm publish `@cobusgreyling/memory-init` + `memory-audit` (optional v0 from git works)
- [ ] GitHub repo public + topics: `ai-agents`, `memory`, `loop-engineering`
- [ ] Cross-link from loop-engineering README
- [ ] 15s GIF: empty → init → score climb
- [ ] Substack essay: “Memory Engineering (the missing layer between context and loops)”

## 5-day launch

1. **D0** Public repo + README hero  
2. **D1** Essay + X thread (amnesia → tiers → score)  
3. **D2** Cross-promo from loop + fleet docs  
4. **D3** Story #1 cold-start morning  
5. **D4** HN/Reddit practical post + pattern picker  

## Success (30d)

| Signal | Target |
|--------|--------|
| Stars | 1k+ if loop cross-promo works; 300+ without |
| npm init weekly | non-zero |
| External pattern PR | ≥1 |

## Do not

- Lead with vector databases
- Launch same day as fleet relaunch blitz
- Skip the score GIF
