import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditMemory } from '../auditor.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('dogfood repo scores at least M1', async () => {
  const result = await auditMemory(repoRoot);
  assert.ok(result.score >= 40, `expected score >= 40, got ${result.score}`);
  assert.ok(['M1', 'M2', 'M3'].includes(result.level));
});

test('empty dir is M0-ish', async () => {
  const result = await auditMemory(path.join(repoRoot, 'tools/memory-audit/test/fixtures-empty'));
  // fixtures-empty may not exist → still low score
  assert.ok(result.score < 40);
  assert.equal(result.level, 'M0');
});
