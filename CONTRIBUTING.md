# Contributing

## Patterns

1. Copy `templates/pattern-template.md`
2. Add file under `patterns/`
3. Register in `patterns/registry.yaml`
4. Open PR with a real or dogfood story if possible

## CLIs

- Keep `memory-init` / `memory-audit` runnable with Node ≥18 and no network
- Add tests under `tools/*/test`
- Run `npm run test:tools`

## Style

Match [loop-engineering](https://github.com/cobusgreyling/loop-engineering): practical, stealable, multi-tool, score-first.
