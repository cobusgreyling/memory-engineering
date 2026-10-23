import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditMemory } from '../auditor.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('dogfood repo scores at least M1', async () => {
  const result = await auditMemory(repoRoot);
  assert.ok(result.score >= 40, `expected score >= 40, got ${result.score}`);
  assert.ok(['M1', 'M2', 'M3'].includes(result.level));
});

test('a hypothesis stored as durable lowers the score', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'memory-audit-'));
  const { initMemory } = await import('../../memory-init/init.js');
  await initMemory(dir, { pattern: 'session-scratchpad', tool: 'grok' });
  const clean = await auditMemory(dir);
  const statePath = path.join(dir, 'MEMORY-STATE.md');
  const state = await readFile(statePath, 'utf8');
  const poisoned = state.replace(
    '## Durable facts',
    '## Durable facts\n\n- 2026-10-22T18:04:00Z [hypothesis] retries are safe; the flake is clock skew\n',
  );
  await writeFile(statePath, poisoned);
  const dirty = await auditMemory(dir);
  assert.ok(dirty.score < clean.score);
  assert.ok(dirty.findings.some((finding) => /hypothesis/.test(finding.message)));
});

test('empty dir is M0-ish', async () => {
  const result = await auditMemory(path.join(repoRoot, 'tools/memory-audit/test/fixtures-empty'));
  // fixtures-empty may not exist → still low score
  assert.ok(result.score < 40);
  assert.equal(result.level, 'M0');
});
