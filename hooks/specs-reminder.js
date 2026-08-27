#!/usr/bin/env node
// specs-workflow — SessionStart / SubagentStart reminder hook
//
// If the working directory contains .agents/specs/index.md, emit a compact
// reminder of the spec workflow so the discipline does not depend on the
// agent remembering it. Otherwise stay silent. Never errors the host:
// every failure path is swallowed and the process exits 0.

'use strict';

const fs = require('fs');
const path = require('path');

const MARK_START = '<!-- specs-workflow:ruleset:start -->';

function readStdin() {
  try {
    if (process.stdin.isTTY) return '';
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

function resolveCwd(raw) {
  try {
    const input = JSON.parse(raw);
    if (input && typeof input.cwd === 'string' && input.cwd) return input.cwd;
  } catch (e) { /* non-JSON stdin: fall back to process cwd */ }
  return process.cwd();
}

function reminderText() {
  return [
    'Specs workflow active (.agents/specs/ detected):',
    '1. Read .agents/specs/index.md first — status bar, Module Status Table, Task Summary.',
    '2. Open only the module docs (requirements/design/tasks) the current request touches; do not load every module.',
    '3. New module or feature: create requirements.md, design.md, tasks.md, CHANGELOG.md under .agents/specs/<module>/ BEFORE coding, and register the module + tasks in index.md.',
    '4. Keep traceability: tasks reference _Requirements: x.y_; design Correctness Properties mark **Validates: Requirements x.y**.',
    '5. After each task: check it off and sync index.md (status bar, Progress, Task Summary); next task and next gate derive from dependencies.',
    '6. Load the `specs-workflow` skill for templates and depth when available.',
  ].join('\n');
}

function writeOutput(eventName, context) {
  if (!context) return;
  const isCodex = Boolean(process.env.PLUGIN_DATA) && !process.env.COPILOT_PLUGIN_DATA;
  if (isCodex) {
    process.stdout.write(JSON.stringify({
      systemMessage: 'specs-workflow active',
      hookSpecificOutput: { hookEventName: eventName, additionalContext: context },
    }));
    return;
  }
  // Native Claude: SessionStart accepts raw stdout, but SubagentStart needs
  // the hookSpecificOutput JSON form or the context is dropped.
  if (eventName === 'SubagentStart') {
    process.stdout.write(JSON.stringify(
      { hookSpecificOutput: { hookEventName: eventName, additionalContext: context } }));
    return;
  }
  process.stdout.write(context);
}

function main() {
  const raw = readStdin();
  let eventName = 'SessionStart';
  try {
    const input = JSON.parse(raw);
    if (input && typeof input.hook_event_name === 'string' && input.hook_event_name) {
      eventName = input.hook_event_name;
    }
  } catch (e) { /* keep default event name */ }

  const cwd = resolveCwd(raw);
  const indexPath = path.join(cwd, '.agents', 'specs', 'index.md');
  if (!fs.existsSync(indexPath)) {
    writeOutput(eventName, '');
    return;
  }
  writeOutput(eventName, reminderText());
}

try {
  main();
} catch (e) {
  // Last-resort guard: a failing hook must never block or error the host.
}
process.exit(0);
