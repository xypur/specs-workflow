#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
}

function parseToml(text, key) {
  const literal = text.match(new RegExp(`^${key}\\s*=\\s*'''([\\s\\S]*?)'''\\s*$`, 'm'));
  if (literal) return literal[1].trim();
  const basic = text.match(new RegExp(`^${key}\\s*=\\s*"([^"]*)"\\s*$`, 'm'));
  if (basic) return basic[1].trim();
  throw new Error(`Cannot parse "${key}" from TOML`);
}

let failed = false;
function check(ok, msg) {
  if (!ok) {
    console.error(msg);
    failed = true;
  }
}

const COMMANDS = ['specs', 'specs-init', 'specs-requirements', 'specs-design', 'specs-tasks'];

// Only the EN chain is synced: rule adapters mirror the canonical ruleset,
// and .opencode/.claude commands mirror the commands/*.toml prompts.
const RULESET = 'rules/specs-workflow.md';
const RULE_COPIES = [
  '.cursor/rules/specs-workflow.mdc',
  '.windsurf/rules/specs-workflow.md',
  '.clinerules/specs-workflow.md',
  '.kiro/steering/specs-workflow.md',
  '.agents/rules/specs-workflow.md',
  '.qoder/rules/specs-workflow.md',
  '.github/copilot-instructions.md',
];
const COMMAND_TOML = (name) => `commands/${name}.toml`;
const COMMAND_TARGETS = [
  { dir: '.opencode/commands', args: '$ARGUMENTS' },
  { dir: '.claude/commands', args: '$ARGUMENTS' },
];

// 1. Ruleset copies: every adapter body equals the canonical compact ruleset.
const rulesetBody = stripFrontmatter(read(RULESET));
for (const rel of RULE_COPIES) {
  check(stripFrontmatter(read(rel)) === rulesetBody, `${rel} drifted from ${RULESET}`);
}

// 2. Commands: derived files equal the commands/*.toml prompt.
for (const name of COMMANDS) {
  const toml = read(COMMAND_TOML(name));
  const description = parseToml(toml, 'description');
  const prompt = parseToml(toml, 'prompt');
  for (const target of COMMAND_TARGETS) {
    const derivedPrompt = prompt.replace(/\{\{args\}\}/g, target.args);
    const md = read(`${target.dir}/${name}.md`);
    const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
    const descMatch = fm && fm[1].match(/^description:\s*(.+)$/m);
    const descriptionInMd = descMatch ? descMatch[1].trim() : '';
    const body = md.replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
    check(descriptionInMd === description, `${target.dir}/${name} description drifted from ${COMMAND_TOML(name)}`);
    check(body === derivedPrompt, `${target.dir}/${name} body drifted from ${COMMAND_TOML(name)}`);
  }
}

if (failed) {
  console.error('Sync check failed. Regenerate the derived files from the canonical sources.');
  process.exit(1);
}

console.log(
  `OK: rule copies match rules/specs-workflow.md; commands match commands/*.toml across .opencode/ and .claude/.`
);
