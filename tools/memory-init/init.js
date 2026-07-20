import { mkdir, readFile, writeFile, stat, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_TEMPLATES = path.resolve(__dirname, '../../templates');
const LOCAL_TEMPLATES = path.resolve(__dirname, 'templates');

const PATTERNS = new Set([
  'session-scratchpad',
  'project-episodic-log',
  'durable-facts-store',
  'retrieval-budget',
  'memory-hygiene-loop',
]);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function templateRoot() {
  if (await exists(LOCAL_TEMPLATES)) return LOCAL_TEMPLATES;
  return REPO_TEMPLATES;
}

async function readTemplate(root, name) {
  return readFile(path.join(root, name), 'utf8');
}

async function writeUnless(target, content, { force }) {
  if (!force && (await exists(target))) {
    return { path: target, status: 'skipped' };
  }
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
  return { path: target, status: force ? 'overwritten' : 'written' };
}

function skillSetFor(pattern) {
  const base = ['memory-write', 'memory-recall'];
  if (pattern === 'memory-hygiene-loop' || pattern === 'retrieval-budget') {
    base.push('memory-hygiene');
  }
  if (pattern === 'durable-facts-store' || pattern === 'memory-hygiene-loop') {
    base.push('memory-verifier');
  }
  if (pattern === 'project-episodic-log') {
    base.push('memory-hygiene');
  }
  return [...new Set(base)];
}

export async function initMemory(target, options = {}) {
  const {
    pattern = 'session-scratchpad',
    tool = 'grok',
    force = false,
    withLoop = false,
  } = options;

  if (!PATTERNS.has(pattern)) {
    throw new Error(`Unknown pattern: ${pattern}. Choose: ${[...PATTERNS].join(', ')}`);
  }

  const root = path.resolve(target);
  await mkdir(root, { recursive: true });
  const tRoot = await templateRoot();
  const written = [];

  // Lean default scaffold so Memory Ready climbs across patterns (loop-style).
  const files = [
    ['MEMORY.md', 'MEMORY.md'],
    ['MEMORY-STATE.md', 'MEMORY-STATE.md'],
    ['memory-constraints.md', 'memory-constraints.md'],
    ['memory-run-log.md', 'memory-run-log.md'],
  ];
  if (
    pattern === 'retrieval-budget' ||
    pattern === 'memory-hygiene-loop' ||
    pattern === 'durable-facts-store' ||
    pattern === 'project-episodic-log'
  ) {
    files.push(['memory-budget.md', 'memory-budget.md']);
  }

  for (const [outName, templateName] of files) {
    let body = await readTemplate(tRoot, templateName);
    body = body
      .replaceAll('{{PATTERN}}', pattern)
      .replaceAll('{{TOOL}}', tool)
      .replaceAll('{{DATE}}', new Date().toISOString().slice(0, 10));
    written.push(await writeUnless(path.join(root, outName), body, { force }));
  }

  // Pattern pointer
  const pointer = `# Active memory pattern\n\n- pattern: ${pattern}\n- tool: ${tool}\n- scaffolded: ${new Date().toISOString()}\n\nSee memory-engineering patterns/${pattern}.md\n`;
  written.push(await writeUnless(path.join(root, 'MEMORY-PATTERN.md'), pointer, { force }));

  const skillsDir = path.join(root, 'skills');
  await mkdir(skillsDir, { recursive: true });
  for (const skill of skillSetFor(pattern)) {
    const templateName = `SKILL.md.${skill}`;
    const body = await readTemplate(tRoot, templateName);
    written.push(
      await writeUnless(path.join(skillsDir, `${skill}.md`), body, { force }),
    );
  }

  // Optional tool hint file
  const toolHints = {
    grok: 'Use Grok skills from skills/*.md. Recall MEMORY-STATE at session start.',
    claude: 'Install skills into .claude/skills or reference skills/*.md from CLAUDE.md.',
    codex: 'Point automations at skills/*.md; append episodic after each run.',
    cursor: 'Add skills path to project rules; keep Durable edits manual.',
  };
  const hint = `# Tool wiring (${tool})\n\n${toolHints[tool] || toolHints.grok}\n\nPattern: ${pattern}\n`;
  written.push(await writeUnless(path.join(root, 'MEMORY-TOOL.md'), hint, { force }));

  // Copy pattern doc if available from monorepo
  const patternSrc = path.resolve(__dirname, `../../patterns/${pattern}.md`);
  if (await exists(patternSrc)) {
    const destDir = path.join(root, 'docs', 'memory-patterns');
    await mkdir(destDir, { recursive: true });
    await cp(patternSrc, path.join(destDir, `${pattern}.md`));
    written.push({ path: path.join(destDir, `${pattern}.md`), status: 'copied' });
  }

  return {
    root,
    pattern,
    tool,
    withLoop,
    written,
  };
}
