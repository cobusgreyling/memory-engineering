#!/usr/bin/env node
import { initMemory } from './init.js';
import { auditMemory, formatHuman } from '../memory-audit/auditor.js';

const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');
const force = args.includes('--force');
const withLoop = args.includes('--with-loop');

let pattern = 'session-scratchpad';
let tool = 'grok';
let target = '.';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--pattern' && args[i + 1]) {
    pattern = args[++i];
    continue;
  }
  if (arg === '--tool' && args[i + 1]) {
    tool = args[++i];
    continue;
  }
  if (arg === '--force' || arg === '--with-loop' || arg === '--help' || arg === '-h') continue;
  if (!arg.startsWith('-') && (target === '.' || arg !== target)) {
    // first non-flag is target
    if (target === '.') target = arg;
  }
}

if (help) {
  console.log(`memory-init — Scaffold memory engineering artifacts (v0.1)

Usage:
  memory-init [path] --pattern <id> [--tool grok|claude|codex|cursor] [--force] [--with-loop]

Patterns:
  session-scratchpad (default)
  project-episodic-log
  durable-facts-store
  retrieval-budget
  memory-hygiene-loop

From clone:
  node tools/memory-init/cli.js /path/to/project --pattern session-scratchpad

Planned npm:
  npx @cobusgreyling/memory-init .
`);
  process.exit(0);
}

try {
  const result = await initMemory(target, { pattern, tool, force, withLoop });
  console.log(`memory-init → ${result.root}`);
  console.log(`pattern: ${result.pattern}  tool: ${result.tool}`);
  console.log('');
  for (const w of result.written) {
    console.log(`  ${w.status.padEnd(12)} ${w.path}`);
  }
  if (withLoop) {
    console.log('\nAlso scaffold a loop (optional):');
    console.log('  npx @cobusgreyling/loop-init . --pattern daily-triage --tool ' + tool);
  }

  console.log('\n--- Memory Ready (post-init) ---');
  const audit = await auditMemory(result.root);
  console.log(formatHuman(audit));
  console.log('\nNext: node tools/memory-audit/cli.js ' + result.root + ' --suggest');
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
