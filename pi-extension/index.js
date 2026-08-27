// specs-workflow — pi extension
//
// - Registers /specs, /specs-init, /specs-requirements, /specs-design,
//   /specs-tasks commands. Prompts are parsed at runtime from the canonical
//   commands/*.toml (single source of truth — no copied prompt text).
// - While the project has .agents/specs/, appends a compact spec-workflow
//   reminder to the system prompt every turn (same text as the plugin hook,
//   reused from hooks/specs-reminder.js).
//
// Install: pi install git:github.com/xypur/specs-workflow
//   (or a local checkout: pi install /absolute/path/to/specs-workflow)

import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { reminderText } = require("../hooks/specs-reminder.js");

const EXTENSION_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(EXTENSION_DIR, "..");

const COMMAND_NAMES = [
  "specs",
  "specs-init",
  "specs-requirements",
  "specs-design",
  "specs-tasks",
];

// Same parsing approach as scripts/check-sync.js: triple-quoted literal first,
// then a single-line basic string.
export function parseToml(text, key) {
  const literal = text.match(new RegExp(`^${key}\\s*=\\s*'''([\\s\\S]*?)'''\\s*$`, "m"));
  if (literal) return literal[1].trim();
  const basic = text.match(new RegExp(`^${key}\\s*=\\s*"([^"]*)"\\s*$`, "m"));
  if (basic) return basic[1].trim();
  throw new Error(`Cannot parse "${key}" from TOML`);
}

export function loadCommand(name) {
  const file = join(REPO_ROOT, "commands", `${name}.toml`);
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, "utf8");
  try {
    return { name, description: parseToml(raw, "description"), prompt: parseToml(raw, "prompt") };
  } catch (e) {
    return null;
  }
}

function hasSpecsDir() {
  try {
    return existsSync(join(process.cwd(), ".agents", "specs", "index.md"));
  } catch (e) {
    return false;
  }
}

export default function specsWorkflowExtension(pi) {
  for (const name of COMMAND_NAMES) {
    const command = loadCommand(name);
    if (!command) {
      console.error(`[specs-workflow] cannot load commands/${name}.toml; /${name} skipped`);
      continue;
    }
    pi.registerCommand(name, {
      description: command.description,
      handler: async (args, ctx) => {
        const prompt = command.prompt.replace(/\{\{args\}\}/g, (args ?? "").trim());
        await ctx.sendUserMessage(prompt);
      },
    });
  }

  // Per-turn reminder while .agents/specs/ exists (covers session start and
  // every subsequent turn, mirroring the Claude/Codex hook behavior).
  pi.on("before_agent_start", async (event) => {
    try {
      if (!hasSpecsDir()) return undefined;
      return { systemPrompt: `${event.systemPrompt}\n\n${reminderText()}` };
    } catch (e) {
      return undefined;
    }
  });
}
