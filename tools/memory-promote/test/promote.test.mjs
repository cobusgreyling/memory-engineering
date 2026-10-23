import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { initMemory } from '../../memory-init/init.js';
import { MemoryError, promoteMemory, writeScratch } from '../promote.js';

async function scaffold() {
  const dir = await mkdtemp(path.join(tmpdir(), 'memory-promote-'));
  await initMemory(dir, { pattern: 'session-scratchpad', tool: 'grok' });
  return dir;
}

test('write appends scratch and leaves durable untouched', async () => {
  const dir = await scaffold();
  const before = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  const written = await writeScratch(dir, {
    text: 'retries are safe; the flake is clock skew',
    tag: 'hypothesis',
    now: new Date('2026-10-22T18:04:00Z'),
  });
  const after = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  assert.match(written.bullet, /\[hypothesis\] retries are safe/);
  assert.match(after, /\[hypothesis\] retries are safe/);
  assert.match(after.split('## Durable')[1], /human or verifier gate/);
  assert.equal(before.includes('[hypothesis]'), false);
});

test('dry-run does not change MEMORY-STATE.md', async () => {
  const dir = await scaffold();
  await writeScratch(dir, { text: 'login failed on CI job 8841', tag: 'observed' });
  const before = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  const result = await promoteMemory(dir, { to: 'episodic', apply: false });
  const after = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  assert.equal(after, before);
  assert.equal(result.changed, false);
  assert.ok(result.plan.episodicEligible.some((bullet) => bullet.text.includes('login failed')));
});

test('episodic apply moves observed notes and keeps hypotheses in scratch', async () => {
  const dir = await scaffold();
  await writeScratch(dir, { text: 'login failed on CI job 8841', tag: 'observed' });
  await writeScratch(dir, { text: 'retries are safe; the flake is clock skew', tag: 'hypothesis' });
  const result = await promoteMemory(dir, { to: 'episodic', apply: true });
  const state = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  const scratch = state.split('## Episodic')[0];
  const episodic = state.split('## Episodic')[1].split('## Durable')[0];
  assert.ok(result.moved >= 1);
  assert.match(scratch, /\[hypothesis\] retries are safe/);
  assert.match(episodic, /login failed on CI job 8841/);
  assert.doesNotMatch(episodic, /\[hypothesis\]/);
});

test('hypothesis cannot become durable', async () => {
  const dir = await scaffold();
  await writeScratch(dir, { text: 'retries are safe; the flake is clock skew', tag: 'hypothesis' });
  await promoteMemory(dir, { to: 'episodic', apply: true });
  const before = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  await writeScratch(dir, {
    text: 'retries are safe; the flake is clock skew',
    tag: 'hypothesis',
  });
  await assert.rejects(
    () =>
      promoteMemory(dir, {
        to: 'durable',
        apply: true,
        by: 'alex',
        match: 'retries are safe',
        evidence: 'a guess',
      }),
    (error) => error instanceof MemoryError && /hypothesis cannot/.test(error.message),
  );
  const after = await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8');
  const durable = after.split('## Durable')[1];
  assert.doesNotMatch(durable, /\[hypothesis\]|confidence:\s*hypothesis/);
  assert.match(after, /\[hypothesis\] retries are safe/);
  assert.match(before, /Adopt tiered memory/);
});

test('durable apply requires a person and evidence', async () => {
  const dir = await scaffold();
  await writeScratch(dir, {
    text: 'auth fixtures use a static token (evidence: PR 442)',
    tag: 'decided',
  });
  await promoteMemory(dir, { to: 'episodic', apply: true, match: 'static token' });
  await assert.rejects(
    () => promoteMemory(dir, { to: 'durable', apply: true, match: 'static token', evidence: 'PR 442' }),
    /--by/,
  );
  const result = await promoteMemory(dir, {
    to: 'durable',
    apply: true,
    by: 'alex',
    match: 'static token',
  });
  assert.equal(result.changed, true);
  const durable = (await readFile(path.join(dir, 'MEMORY-STATE.md'), 'utf8')).split('## Durable')[1];
  assert.match(durable, /confidence: decided/);
  assert.match(durable, /owner: alex/);
  assert.match(durable, /evidence: PR 442/);
  assert.match(durable, /fact: auth fixtures use a static token/);
});

test('write refuses secret-shaped notes', async () => {
  const dir = await scaffold();
  await assert.rejects(
    () => writeScratch(dir, { text: 'api_key=abcdefghijklmnopqr', tag: 'observed' }),
    /secret/,
  );
});
