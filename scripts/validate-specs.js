#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(process.argv[2] || process.cwd());
const specsRoot = path.join(projectRoot, '.specs');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    fail(`Missing or unreadable file: ${path.relative(projectRoot, filePath)}`);
    return '';
  }
}

function rowsBetween(text, startHeading, endHeading) {
  const start = text.indexOf(startHeading);
  if (start < 0) return [];
  const end = endHeading ? text.indexOf(endHeading, start + startHeading.length) : text.length;
  return text.slice(start, end < 0 ? text.length : end).split('\n');
}

function tableRows(lines) {
  return lines
    .filter((line) => /^\s*\|/.test(line) && !/^\s*\|[-| :]+\|\s*$/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length > 1);
}

function checkFences(text, label) {
  const stack = [];
  for (const [index, line] of text.split('\n').entries()) {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (!match) continue;
    const marker = match[1];
    const char = marker[0];
    if (stack.length && stack[stack.length - 1].char === char && marker.length >= stack[stack.length - 1].length) {
      stack.pop();
    } else {
      stack.push({ char, length: marker.length, line: index + 1 });
    }
  }
  for (const fence of stack) {
    fail(`${label}:${fence.line}: unclosed Markdown fence`);
  }
}

function requirementClauses(text, label) {
  const headings = [...text.matchAll(/^###\s+Requirement\s+(\d+)\b/gm)];
  const requirementNumbers = headings.map((match) => Number(match[1]));
  requirementNumbers.forEach((number, index) => {
    if (number !== index + 1) fail(`${label}: Requirement numbers must be contiguous from 1`);
  });

  const clauses = new Set();
  headings.forEach((heading, index) => {
    const end = index + 1 < headings.length ? headings[index + 1].index : text.length;
    const block = text.slice(heading.index, end);
    const criteria = block.match(/####\s+Acceptance Criteria([\s\S]*)/m);
    if (!criteria) {
      fail(`${label}: Requirement ${heading[1]} has no Acceptance Criteria section`);
      return;
    }
    const numbers = [...criteria[1].matchAll(/^\s*(\d+)\.\s+/gm)].map((match) => Number(match[1]));
    numbers.forEach((number, clauseIndex) => {
      if (number !== clauseIndex + 1) fail(`${label}: Requirement ${heading[1]} acceptance criteria are not contiguous`);
      clauses.add(`${heading[1]}.${number}`);
    });
    if (!numbers.length) fail(`${label}: Requirement ${heading[1]} has no numbered acceptance criteria`);
  });
  return clauses;
}

function references(text, pattern) {
  const result = new Set();
  for (const match of text.matchAll(pattern)) {
    for (const ref of match[1].matchAll(/\b\d+\.\d+\b/g)) result.add(ref[0]);
  }
  return result;
}

function taskRecords(text, label, clauses) {
  const lines = text.split('\n');
  const records = [];
  const taskPattern = /^\s*-\s*\[([ xX])\]\s+((?:\d+\.)+\d+)\s+(.+)$/;
  lines.forEach((line, index) => {
    const match = line.match(taskPattern);
    if (!match) return;
    const next = lines.slice(index + 1).findIndex((candidate) => taskPattern.test(candidate));
    const end = next < 0 ? lines.length : index + 1 + next;
    const block = lines.slice(index, end).join('\n');
    const refs = references(block, /_Requirements:\s*([^_]+)_/g);
    if (!refs.size) fail(`${label}:${index + 1}: task ${match[2]} has no _Requirements: reference`);
    for (const ref of refs) {
      if (!clauses.has(ref)) fail(`${label}:${index + 1}: task ${match[2]} references missing requirement clause ${ref}`);
    }
    records.push({ id: match[2], checked: match[1].toLowerCase() === 'x', title: match[3].trim(), refs });
  });
  const ids = new Set(records.map((record) => record.id));
  if (ids.size !== records.length) fail(`${label}: task IDs must be unique`);
  return records;
}

function dependencyGraph(text, label, records) {
  const graphMatch = text.match(/##\s+Task Dependency Graph[\s\S]*?```json\s*([\s\S]*?)```/i);
  if (!graphMatch) {
    fail(`${label}: missing JSON Task Dependency Graph`);
    return;
  }
  let graph;
  try {
    graph = JSON.parse(graphMatch[1]);
  } catch {
    fail(`${label}: Task Dependency Graph is not valid JSON`);
    return;
  }
  const listed = new Set((graph.waves || []).flatMap((wave) => wave.tasks || []));
  const expected = new Set(records.map((record) => record.id));
  for (const id of expected) if (!listed.has(id)) fail(`${label}: dependency graph omits task ${id}`);
  for (const id of listed) if (!expected.has(id)) fail(`${label}: dependency graph references unknown task ${id}`);
}

function validateModule(moduleName) {
  const moduleRoot = path.join(specsRoot, moduleName);
  if (!fs.existsSync(moduleRoot) || !fs.statSync(moduleRoot).isDirectory()) {
    fail(`Index lists missing module directory: .specs/${moduleName}`);
    return null;
  }
  for (const file of ['requirements.md', 'design.md', 'tasks.md', 'CHANGELOG.md']) {
    if (!fs.existsSync(path.join(moduleRoot, file))) fail(`.specs/${moduleName}: missing ${file}`);
  }
  const requirements = readFile(path.join(moduleRoot, 'requirements.md'));
  const design = readFile(path.join(moduleRoot, 'design.md'));
  const tasks = readFile(path.join(moduleRoot, 'tasks.md'));
  const label = `.specs/${moduleName}`;
  checkFences(requirements, `${label}/requirements.md`);
  checkFences(design, `${label}/design.md`);
  checkFences(tasks, `${label}/tasks.md`);
  const clauses = requirementClauses(requirements, `${label}/requirements.md`);
  for (const ref of references(design, /\*\*Validates:\s*([^*]+)\*\*/g)) {
    if (!clauses.has(ref)) fail(`${label}/design.md: dangling Validates reference ${ref}`);
  }
  const records = taskRecords(tasks, `${label}/tasks.md`, clauses);
  dependencyGraph(tasks, `${label}/tasks.md`, records);
  return { moduleName, records };
}

if (!fs.existsSync(specsRoot)) fail(`Missing .specs directory in ${projectRoot}`);
const indexPath = path.join(specsRoot, 'index.md');
const indexText = readFile(indexPath);
const statuses = new Map();
for (const cells of tableRows(rowsBetween(indexText, '## Module Status Table', '## Task Summary'))) {
  if (cells[0] && cells[0] !== 'Module') statuses.set(cells[0], cells[1]);
}
const validStatuses = new Set(['draft', 'design', 'implementing', 'implemented', 'archived']);
for (const [moduleName, status] of statuses) {
  if (!validStatuses.has(status)) fail(`.specs/index.md: invalid status for ${moduleName}: ${status}`);
}

const modules = [...statuses.keys()].map((moduleName) => validateModule(moduleName)).filter(Boolean);
const allTasks = new Map();
for (const module of modules) {
  for (const record of module.records) {
    const id = `${module.moduleName}.${record.id}`;
    if (allTasks.has(id)) fail(`Duplicate global task ID: ${id}`);
    allTasks.set(id, { ...record, module: module.moduleName });
  }
}

const summaryRows = tableRows(rowsBetween(indexText, '## Task Summary', '## Execution Order / Dependencies'));
const summary = new Map();
for (const cells of summaryRows) {
  if (cells[0] && cells[0] !== 'Task') summary.set(cells[0], cells);
}
for (const [id, record] of allTasks) {
  const row = summary.get(id);
  if (!row) {
    fail(`.specs/index.md: missing Task Summary row for ${id}`);
    continue;
  }
  if (row[3] !== (record.checked ? '[x]' : '[ ]')) fail(`.specs/index.md: status mismatch for ${id}`);
  const depends = (row[4] || '').split(',').map((value) => value.trim()).filter(Boolean).filter((value) => value !== '-');
  for (const dependency of depends) if (!allTasks.has(dependency)) fail(`.specs/index.md: ${id} depends on unknown task ${dependency}`);
}
for (const id of summary.keys()) if (!allTasks.has(id)) fail(`.specs/index.md: Task Summary references unknown task ${id}`);

function visit(id, visiting, visited) {
  if (visiting.has(id)) {
    fail(`.specs/index.md: dependency cycle includes ${id}`);
    return;
  }
  if (visited.has(id)) return;
  visiting.add(id);
  const row = summary.get(id);
  const depends = row ? (row[4] || '').split(',').map((value) => value.trim()).filter((value) => value && value !== '-') : [];
  for (const dependency of depends) if (allTasks.has(dependency)) visit(dependency, visiting, visited);
  visiting.delete(id);
  visited.add(id);
}
const visited = new Set();
for (const id of allTasks.keys()) visit(id, new Set(), visited);

for (const moduleName of statuses.keys()) {
  const moduleRoot = path.join(specsRoot, moduleName);
  if (fs.existsSync(moduleRoot)) {
    for (const file of fs.readdirSync(moduleRoot)) {
      if (/^v\d+\.md$/i.test(file)) fail(`.specs/${moduleName}: versioned design file is forbidden: ${file}`);
    }
  }
}

if (errors.length) {
  console.error(`Specs validation failed for ${projectRoot}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: .specs validation passed for ${projectRoot}`);
