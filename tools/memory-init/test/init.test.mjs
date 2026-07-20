import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { initMemory } from '../init.js';
import { auditMemory } from '../../memory-audit/auditor.js';

test('init raises empty project to at least M1', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'memory-init-'));
  await initMemory(dir, { pattern: 'session-scratchpad', tool: 'grok' });
  const md = await readFile(path.join(dir, 'MEMORY.md'), 'utf8');
  assert.ok(md.includes('Scratch') || md.includes('scratch'));
  const audit = await auditMemory(dir);
  assert.ok(audit.score >= 40, `score ${audit.score}`);
});
