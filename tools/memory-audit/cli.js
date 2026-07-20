#!/usr/bin/env node
import { auditMemory, formatHuman, formatSuggestions } from './auditor.js';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('-')) || '.';
const suggest = args.includes('--suggest');
const json = args.includes('--json');
const help = args.includes('--help') || args.includes('-h');
const minScoreArg = args.find((a) => a.startsWith('--min-score='));
const minScore = minScoreArg ? Number(minScoreArg.split('=')[1]) : null;

if (help) {
  console.log(`memory-audit — Memory Ready Score CLI (v0.1)

Usage:
  memory-audit [path] [options]

Options:
  --json              JSON output
  --suggest           Show scaffold commands for gaps
  --min-score=N       Exit 1 if score < N (CI gate)
  --help              This help

Levels: M0 (ad-hoc) → M1 (structured) → M2 (budgeted) → M3 (gated durable)

Install (planned): npx @cobusgreyling/memory-audit [path]
From clone:        node tools/memory-audit/cli.js [path]
`);
  process.exit(0);
}

const result = await auditMemory(target);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatHuman(result));

if (suggest) {
  console.log('\n=== Suggested actions ===');
  for (const line of formatSuggestions(result)) console.log(`  ${line}`);
}

if (minScore != null && Number.isFinite(minScore) && result.score < minScore) {
  process.exitCode = 1;
} else if (minScore == null && result.score < 40) {
  process.exitCode = 2;
}
