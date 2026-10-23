#!/usr/bin/env node
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { initMemory } from './tools/memory-init/init.js';
import { auditMemory, formatHuman, formatSuggestions } from './tools/memory-audit/auditor.js';
import { MemoryError, formatPlan, promoteMemory, writeScratch } from './tools/memory-promote/promote.js';

const HELP = `memory — one command for memory engineering

Use it from this clone. No install.

  node memory.js init <project>
  node memory.js write <project> "what you learned" --tag hypothesis
  node memory.js promote <project>
  node memory.js promote <project> --apply --to episodic
  node memory.js audit <project> --suggest

Commands:
  init [path]     Scaffold MEMORY.md, MEMORY-STATE.md, skills
                  --pattern session-scratchpad (default) | project-episodic-log |
                            durable-facts-store | retrieval-budget | memory-hygiene-loop
                  --tool grok (default) | claude | codex | cursor
                  --force
  write [path] "note"
                  Append a Scratch bullet. --tag hypothesis (default) | observed | decided
  promote [path]  Show what may move. Dry-run unless --apply.
                  --apply --to episodic          move up to 3 observed/decided notes
                  --apply --to durable --by "Name" --evidence "PR or path" --match "words"
                  A hypothesis never becomes durable.
  audit [path]    Memory Ready score
                  --suggest  --json  --min-score=N

Read the worked example without running anything:
  examples/morning-after/README.md
`;

function parseArgs(argv) {
  const positional = [];
  const flags = { tag: 'hypothesis', to: 'episodic' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') flags.apply = true;
    else if (arg === '--suggest') flags.suggest = true;
    else if (arg === '--json') flags.json = true;
    else if (arg === '--force') flags.force = true;
    else if (arg === '--with-loop') flags.withLoop = true;
    else if (arg === '--help' || arg === '-h') flags.help = true;
    else if (arg.startsWith('--min-score=')) flags.minScore = Number(arg.split('=')[1]);
    else if (
      arg === '--pattern' ||
      arg === '--tool' ||
      arg === '--tag' ||
      arg === '--to' ||
      arg === '--by' ||
      arg === '--evidence' ||
      arg === '--match' ||
      arg === '--text'
    ) {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new MemoryError(`${arg} needs a value.`);
      flags[arg.slice(2)] = value;
      i += 1;
    } else if (arg.startsWith('--')) {
      throw new MemoryError(`Unknown flag ${arg}. Run: node memory.js --help`);
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

async function isDir(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

async function pathAndText(positional) {
  if (positional.length === 0) return { target: '.', text: '' };
  if (positional.length === 1) {
    if (positional[0] === '.' || (await isDir(positional[0]))) {
      return { target: positional[0], text: '' };
    }
    return { target: '.', text: positional[0] };
  }
  if (positional[0] === '.' || (await isDir(positional[0]))) {
    return { target: positional[0], text: positional.slice(1).join(' ') };
  }
  return { target: '.', text: positional.join(' ') };
}

function targetFrom(positional) {
  return positional[0] && !positional[0].includes(' ') ? positional[0] : '.';
}

function rewriteSuggestions(lines, target) {
  const shown = target === '.' ? '.' : target;
  return lines.map((line) =>
    line
      .replaceAll('node tools/memory-init/cli.js .', `node memory.js init ${shown}`)
      .replaceAll('node memory.js init .', `node memory.js init ${shown}`),
  );
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }
  const { positional, flags } = parseArgs(rest);
  if (flags.help) {
    console.log(HELP);
    return;
  }

  if (command === 'init') {
    const target = positional[0] || '.';
    const result = await initMemory(target, {
      pattern: flags.pattern || 'session-scratchpad',
      tool: flags.tool || 'grok',
      force: Boolean(flags.force),
      withLoop: Boolean(flags.withLoop),
    });
    console.log(`memory init → ${result.root}`);
    console.log(`pattern: ${result.pattern}    tool: ${result.tool}`);
    console.log('');
    for (const item of result.written) console.log(`  ${item.status.padEnd(12)} ${item.path}`);
    console.log('\n--- Memory Ready ---');
    const audit = await auditMemory(result.root);
    console.log(formatHuman(audit));
    console.log('\nNext:');
    console.log(`  node memory.js write ${result.root} "what you learned" --tag hypothesis`);
    console.log(`  node memory.js promote ${result.root}`);
    console.log(`  node memory.js audit ${result.root} --suggest`);
    return;
  }

  if (command === 'audit') {
    const target = positional[0] || '.';
    const result = await auditMemory(target);
    if (flags.json) console.log(JSON.stringify(result, null, 2));
    else console.log(formatHuman(result));
    if (flags.suggest) {
      console.log('\nSuggested next commands');
      for (const line of rewriteSuggestions(formatSuggestions(result), target)) {
        console.log(`  ${line}`);
      }
    }
    const failed = result.findings.some((finding) => finding.level === 'fail');
    if (flags.minScore != null && Number.isFinite(flags.minScore) && result.score < flags.minScore) {
      process.exitCode = 1;
    } else if (failed) {
      process.exitCode = 1;
    } else if (flags.minScore == null && result.score < 40) {
      process.exitCode = 2;
    }
    return;
  }

  if (command === 'write') {
    const parsed = await pathAndText(positional);
    const text = flags.text || parsed.text;
    const written = await writeScratch(parsed.target, { text, tag: flags.tag });
    console.log(written.bullet);
    console.log(`wrote ${written.file}`);
    return;
  }

  if (command === 'promote') {
    const target = targetFrom(positional);
    const result = await promoteMemory(path.resolve(target), {
      to: flags.to,
      apply: Boolean(flags.apply),
      by: flags.by || '',
      evidence: flags.evidence || '',
      match: flags.match || '',
    });
    console.log(formatPlan(result.plan, target));
    if (result.changed) console.log(`\nupdated ${result.file}`);
    return;
  }

  throw new MemoryError(`Unknown command "${command}". Run: node memory.js --help`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = error.code || 1;
});
