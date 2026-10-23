import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BULLET =
  /^- (\d{4}-\d{2}-\d{2}(?:T[0-9:.Z+-]*)?)\s+\[(observed|decided|hypothesis)\]\s+(.+)$/;

const SECRET_HINTS = [
  /api[_-]?key\s*[:=]\s*['"]?[a-z0-9_-]{16,}/i,
  /-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----/,
  /aws_secret_access_key/i,
  /xox[baprs]-[0-9a-zA-Z-]+/,
];

export class MemoryError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.code = code;
  }
}

export function splitSections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = { heading: null, lines: [] };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      sections.push(current);
      current = { heading: line, lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);
  return sections;
}

export function joinSections(sections) {
  const out = [];
  for (const section of sections) {
    if (section.heading) out.push(section.heading);
    out.push(...section.lines);
  }
  let text = out.join('\n');
  if (!text.endsWith('\n')) text += '\n';
  return text;
}

export function sectionKind(heading) {
  if (!heading) return 'preamble';
  if (/^##\s+scratch\b/i.test(heading)) return 'scratch';
  if (/^##\s+episodic\b/i.test(heading)) return 'episodic';
  if (/^##\s+durable\b/i.test(heading)) return 'durable';
  return 'other';
}

export function parseBullet(line) {
  const match = BULLET.exec(line.trim());
  if (!match) return null;
  return { at: match[1], tag: match[2], text: match[3], line: line.trim() };
}

function findSection(sections, kind) {
  return sections.find((section) => sectionKind(section.heading) === kind) || null;
}

function bulletsIn(section) {
  if (!section) return [];
  return section.lines.map(parseBullet).filter(Boolean);
}

function insertBullet(section, bullet) {
  const lines = section.lines.slice();
  let index = lines.length;
  while (index > 0 && lines[index - 1].trim() === '') index -= 1;
  lines.splice(index, 0, bullet);
  section.lines = lines;
}

function removeLineOnce(section, line) {
  const index = section.lines.findIndex((item) => item.trim() === line.trim());
  if (index === -1) return false;
  section.lines.splice(index, 1);
  return true;
}

function stamp(now) {
  return (now instanceof Date ? now : new Date(now || Date.now()))
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z');
}

function slug(text) {
  const words = text
    .toLowerCase()
    .replace(/\(evidence:[\s\S]*\)/i, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  return words.join('.') || 'fact';
}

function evidenceIn(text) {
  const match = /evidence:\s*([^)]+?)\)?$/i.exec(text);
  return match ? match[1].trim() : '';
}

function factText(text) {
  return text.replace(/\s*\(evidence:[\s\S]*\)\s*$/i, '').trim();
}

function durableBlock({ bullet, by, evidence, now }) {
  const day = stamp(now).slice(0, 10);
  return [
    `- id: ${slug(bullet.text)}`,
    `  fact: ${factText(bullet.text)}`,
    `  confidence: ${bullet.tag}`,
    `  owner: ${by}`,
    `  evidence: ${evidence}`,
    `  status: active`,
    `  as_of: ${day}`,
  ].join('\n');
}

function assertNoSecret(text) {
  if (SECRET_HINTS.some((pattern) => pattern.test(text))) {
    throw new MemoryError('Refused: that note looks like a secret. It stays out of memory.');
  }
}

async function readState(root) {
  const file = path.join(root, 'MEMORY-STATE.md');
  try {
    return { file, markdown: await readFile(file, 'utf8') };
  } catch {
    throw new MemoryError(
      `No MEMORY-STATE.md in ${root}. Run: node memory.js init ${root}`,
      2,
    );
  }
}

export async function writeScratch(root, { text, tag = 'hypothesis', now = new Date() } = {}) {
  const note = String(text || '').trim();
  if (!note) throw new MemoryError('Write needs the note text.');
  if (!['observed', 'decided', 'hypothesis'].includes(tag)) {
    throw new MemoryError('Tag must be observed, decided, or hypothesis.');
  }
  assertNoSecret(note);
  const { file, markdown } = await readState(root);
  const sections = splitSections(markdown);
  const scratch = findSection(sections, 'scratch');
  if (!scratch) {
    throw new MemoryError('MEMORY-STATE.md has no Scratch section. Run init again.');
  }
  const bullet = `- ${stamp(now)} [${tag}] ${note}`;
  insertBullet(scratch, bullet);
  await writeFile(file, joinSections(sections));
  await appendRunLog(root, `write scratch [${tag}] ${note.slice(0, 80)}`, now, 'write');
  return { bullet, file };
}

function durableHypotheses(section) {
  if (!section) return [];
  const body = section.lines.join('\n');
  const hits = [];
  for (const bullet of bulletsIn(section)) {
    if (bullet.tag === 'hypothesis') hits.push(bullet.text);
  }
  if (/confidence:\s*hypothesis/i.test(body)) {
    const fact = /fact:\s*(.+)/i.exec(body);
    hits.push(fact ? fact[1].trim() : 'a durable block tagged hypothesis');
  }
  return hits;
}

export function planPromotion(markdown, options = {}) {
  const to = options.to || 'episodic';
  if (to !== 'episodic' && to !== 'durable') {
    throw new MemoryError('--to must be episodic or durable.');
  }
  const sections = splitSections(markdown);
  const scratch = findSection(sections, 'scratch');
  const episodic = findSection(sections, 'episodic');
  const durable = findSection(sections, 'durable');
  const scratchBullets = bulletsIn(scratch);
  const episodicBullets = bulletsIn(episodic);
  const match = options.match ? String(options.match).toLowerCase() : '';
  const matches = (bullet) => !match || bullet.text.toLowerCase().includes(match);

  const episodicEligible = scratchBullets.filter(
    (bullet) => bullet.tag !== 'hypothesis' && matches(bullet),
  );
  const scratchBlocked = scratchBullets.filter((bullet) => bullet.tag === 'hypothesis' && matches(bullet));
  const durableEligible = episodicBullets.filter(
    (bullet) => bullet.tag !== 'hypothesis' && matches(bullet),
  );
  const durableBlocked = episodicBullets.filter(
    (bullet) => bullet.tag === 'hypothesis' && matches(bullet),
  );

  return {
    to,
    apply: Boolean(options.apply),
    by: options.by || '',
    evidence: options.evidence || '',
    match,
    episodicEligible: episodicEligible.slice(0, 3),
    episodicSkipped: Math.max(0, episodicEligible.length - 3),
    scratchBlocked,
    durableEligible,
    durableBlocked,
    durableViolations: durableHypotheses(durable),
    sections,
  };
}

export function formatPlan(plan, target = '.') {
  const lines = [plan.apply ? 'Promote (applying)' : 'Promote (dry-run)', ''];
  if (plan.durableViolations.length) {
    lines.push('Durable already holds a hypothesis. Move it back to Scratch:');
    for (const text of plan.durableViolations) lines.push(`  - ${text}`);
    lines.push('');
  }
  const movingEpisodic = plan.apply && plan.to === 'episodic';
  lines.push(movingEpisodic ? 'Moved Scratch → Episodic:' : 'Can move Scratch → Episodic:');
  if (plan.episodicEligible.length === 0) lines.push('  (none)');
  for (const bullet of plan.episodicEligible) {
    lines.push(`  - [${bullet.tag}] ${bullet.text}`);
  }
  if (plan.episodicSkipped) lines.push(`  … ${plan.episodicSkipped} more wait for the next run (cap 3)`);
  lines.push('');
  lines.push('Stays in Scratch (hypothesis):');
  if (plan.scratchBlocked.length === 0) lines.push('  (none)');
  for (const bullet of plan.scratchBlocked) lines.push(`  - ${bullet.text}`);
  lines.push('');
  if (movingEpisodic) return lines.join('\n');
  lines.push(
    plan.apply && plan.to === 'durable'
      ? 'Moved Episodic → Durable:'
      : 'Can move Episodic → Durable (needs --by and evidence):',
  );
  if (plan.durableEligible.length === 0) lines.push('  (none)');
  for (const bullet of plan.durableEligible) {
    const needsEvidence = !evidenceIn(bullet.text);
    lines.push(`  - [${bullet.tag}] ${bullet.text}${needsEvidence ? '  (needs --evidence)' : ''}`);
  }
  if (plan.durableBlocked.length) {
    lines.push('');
    lines.push('Refused for Durable (hypothesis):');
    for (const bullet of plan.durableBlocked) lines.push(`  - ${bullet.text}`);
  }
  lines.push('');
  if (!plan.apply) {
    lines.push('Apply:');
    lines.push(`  node memory.js promote ${target} --apply --to episodic`);
    lines.push(
      `  node memory.js promote ${target} --apply --to durable --by "Your Name" --evidence "PR or path" --match "words"`,
    );
  }
  return lines.join('\n');
}

function applyEpisodic(plan) {
  const scratch = findSection(plan.sections, 'scratch');
  const episodic = findSection(plan.sections, 'episodic');
  if (!scratch || !episodic) {
    throw new MemoryError('MEMORY-STATE.md needs Scratch and Episodic sections.');
  }
  if (plan.episodicEligible.length === 0) {
    throw new MemoryError('Nothing to promote. Hypotheses stay in Scratch.');
  }
  for (const bullet of plan.episodicEligible) {
    removeLineOnce(scratch, bullet.line);
    insertBullet(episodic, bullet.line);
  }
  return plan.episodicEligible.length;
}

function applyDurable(plan, now) {
  const episodic = findSection(plan.sections, 'episodic');
  const durable = findSection(plan.sections, 'durable');
  if (!episodic || !durable) {
    throw new MemoryError('MEMORY-STATE.md needs Episodic and Durable sections.');
  }
  if (!plan.by.trim()) {
    throw new MemoryError('Durable promotion needs a person or verifier: --by "Name".');
  }
  if (plan.durableBlocked.length && plan.durableEligible.length === 0) {
    throw new MemoryError(
      `Refused: a hypothesis cannot become durable (${plan.durableBlocked[0].text}).`,
    );
  }
  let chosen = plan.durableEligible;
  if (plan.match) chosen = chosen.filter((bullet) => bullet.text.toLowerCase().includes(plan.match));
  if (chosen.length === 0) {
    throw new MemoryError('No episodic note matched. A hypothesis cannot be promoted to Durable.');
  }
  if (chosen.length > 1) {
    throw new MemoryError('More than one match. Pass --match with a shorter unique phrase.');
  }
  const bullet = chosen[0];
  const evidence = plan.evidence || evidenceIn(bullet.text);
  if (!evidence) {
    throw new MemoryError('Durable promotion needs evidence: --evidence "PR 442" or "(evidence: …)" on the note.');
  }
  removeLineOnce(episodic, bullet.line);
  insertBullet(durable, durableBlock({ bullet, by: plan.by.trim(), evidence, now }));
  return bullet;
}

export async function promoteMemory(root, options = {}) {
  const { markdown, file } = await readState(root);
  const plan = planPromotion(markdown, options);
  if (!options.apply) return { plan, changed: false, file };
  const now = options.now || new Date();
  if (options.to === 'durable' && plan.durableViolations.length && plan.durableEligible.length === 0) {
    const violation = plan.durableViolations.find((text) =>
      plan.match ? text.toLowerCase().includes(plan.match) : true,
    );
    if (violation) {
      throw new MemoryError(
        `Refused: a hypothesis cannot become durable (${violation}). Move it back to Scratch.`,
      );
    }
  }
  if (options.to === 'durable') {
    const bullet = applyDurable(plan, now);
    await writeFile(file, joinSections(plan.sections));
    await appendRunLog(
      root,
      `promote episodic→durable by ${plan.by}: ${factText(bullet.text).slice(0, 80)}`,
      now,
      'promote',
    );
    return { plan, changed: true, file, moved: 1 };
  }
  const moved = applyEpisodic(plan);
  await writeFile(file, joinSections(plan.sections));
  await appendRunLog(root, `promote scratch→episodic n=${moved}`, now, 'promote');
  return { plan, changed: true, file, moved };
}

export async function appendRunLog(root, note, now = new Date(), op = 'promote') {
  const file = path.join(root, 'memory-run-log.md');
  let body = '';
  try {
    body = await readFile(file, 'utf8');
  } catch {
    body = '# Memory Run Log\n\n| ts | op | tokens | notes |\n|----|----|--------|-------|\n';
  }
  if (!body.endsWith('\n')) body += '\n';
  body += `| ${stamp(now)} | ${op} | — | ${note.replace(/\|/g, '/')} |\n`;
  await writeFile(file, body);
}
