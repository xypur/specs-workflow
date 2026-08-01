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

// Languages: en (repo root) and zh (src/ mirrors, .zh.* suffix).
const languages = [
  {
    name: 'EN',
    ruleset: 'rules/specs-workflow.md',
    ruleCopies: [
      '.cursor/rules/specs-workflow.mdc',
      '.windsurf/rules/specs-workflow.md',
      '.clinerules/specs-workflow.md',
      '.kiro/steering/specs-workflow.md',
      '.agents/rules/specs-workflow.md',
      '.qoder/rules/specs-workflow.md',
      '.github/copilot-instructions.md',
    ],
    commandToml: (name) => `commands/${name}.toml`,
    commandDirs: ['.opencode/commands', '.claude/commands'],
  },
  {
    name: 'ZH',
    ruleset: 'src/rules/specs-workflow.zh.md',
    ruleCopies: [
      'src/.cursor/rules/specs-workflow.zh.mdc',
      'src/.windsurf/rules/specs-workflow.zh.md',
      'src/.clinerules/specs-workflow.zh.md',
      'src/.kiro/steering/specs-workflow.zh.md',
      'src/.agents/rules/specs-workflow.zh.md',
      'src/.qoder/rules/specs-workflow.zh.md',
      'src/.github/copilot-instructions.zh.md',
    ],
    commandToml: (name) => `src/commands/${name}.zh.toml`,
    commandDirs: ['src/.opencode/commands', 'src/.claude/commands'],
  },
];

for (const lang of languages) {
  // 1. Ruleset copies: every adapter body equals the canonical compact ruleset.
  const rulesetBody = stripFrontmatter(read(lang.ruleset));
  for (const rel of lang.ruleCopies) {
    check(
      stripFrontmatter(read(rel)) === rulesetBody,
      `${rel} drifted from ${lang.ruleset}`
    );
  }

  // 2. Commands: derived files equal the commands/*.toml prompt.
  for (const name of COMMANDS) {
    const toml = read(lang.commandToml(name));
    const description = parseToml(toml, 'description');
    const prompt = parseToml(toml, 'prompt').replace(/\{\{args\}\}/g, '$1');
    for (const dir of lang.commandDirs) {
      const md = read(`${dir}/${name}${lang.name === 'ZH' ? '.zh' : ''}.md`);
      const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
      const descMatch = fm && fm[1].match(/^description:\s*(.+)$/m);
      const descriptionInMd = descMatch ? descMatch[1].trim() : '';
      const body = md.replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
      check(descriptionInMd === description, `${dir}/${name} description drifted from ${lang.commandToml(name)}`);
      check(body === prompt, `${dir}/${name} body drifted from ${lang.commandToml(name)}`);
    }
  }
}

if (failed) {
  console.error('Sync check failed. Regenerate the derived files from the canonical sources.');
  process.exit(1);
}

console.log(
  `OK: rule copies match rules/specs-workflow.md (EN + ZH); commands match commands/*.toml across .opencode/ and .claude/.`
);
