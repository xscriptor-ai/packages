#!/usr/bin/env node
// @xscriptor/ai-agents - Install AI agents, skills, and commands for OpenCode and Claude Code.
// Usage: npx @xscriptor/ai-agents [--all|--agents|--senior|--skills|--commands] [--opencode|--anthropic|--project]
import {
  existsSync, mkdirSync, copyFileSync, readdirSync, statSync,
  writeFileSync, mkdtempSync, rmSync,
} from "fs";
import { execFileSync } from "child_process";
import { join, dirname } from "path";
import { tmpdir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = join(__dirname, "..");
const PACKAGES_ROOT = join(PKG_DIR, "..", "..");
const WORKSPACE_ROOT = join(PACKAGES_ROOT, "..");
const REF = process.env.XSCRIPTOR_REF || "main";
const AGENTS_REPO = "xscriptor-ai/agents";
const SKILLS_REPO = "xscriptor-ai/skills";

const HELP = `
Usage: npx @xscriptor/ai-agents [options]

Selection (default: --all):
  --all               Install everything: agents + senior + skills + commands
  --agents            Specialized agents only
  --senior            Senior agents only
  --skills            Skills only (project + senior)
  --commands          Commands only
  --groups LIST       Comma-separated groups (e.g. general,web/security)

Target (default: --opencode):
  --opencode          Install to ~/.config/opencode/
  --anthropic         Install to ~/.claude/
  --project           Install to .opencode/ (current dir)

Sources (default: local checkout, then GitHub):
  --src DIR           Workspace root containing the agents/skills repos

Other:
  --dry-run           Preview without copying
  --list              List available groups
  --help              Show this help

Examples:
  npx @xscriptor/ai-agents
  npx @xscriptor/ai-agents --senior
  npx @xscriptor/ai-agents --skills
  npx @xscriptor/ai-agents --commands
  npx @xscriptor/ai-agents --groups general,languages
`;

const AGENT_GROUPS = [
  "general", "languages", "web/security", "web/architecture", "web/frontend", "web/backend",
  "mobile", "data-ml", "cloud", "testing", "content", "observability", "compliance",
  "security/recon", "security/web-pentest", "security/mobile-pentest", "security/desktop",
  "security/red-team", "security/blue-team", "security/ai-ml-security", "security/purple-team",
  "graphql", "embedded", "game-dev", "automotive-security", "aviation-security",
  "blockchain-security", "github", "hardware-security", "mainframe-security",
  "maritime-security", "medical-security", "mega", "physical-security",
  "privacy-engineering", "systems", "telecom-security",
];

const SENIOR_GROUPS = [
  "cloud", "compliance", "content", "data-ml", "game-dev", "github", "go", "java-kotlin",
  "mobile", "python", "rust", "security", "systems", "testing", "typescript", "web",
];

const SENIOR_SKILLS = [
  "api-design", "architecture", "cloud", "deployment", "go", "java-kotlin", "mobile",
  "monorepo", "observability", "performance", "python", "rust", "secure-coding", "security",
  "systems", "testing", "typescript", "web",
];

const SKILL_ROUTES = [
  { name: "xscriptor", src: "web/literature/xscriptor" },
  { name: "devx", src: "web/dev/devx/devx" },
  { name: "samurai", src: "web/cybersec/samurai" },
];

const roots = {};

function rootsFrom(base) {
  if (!base || !existsSync(base)) return null;
  const found = {};
  const agentsRepo = join(base, "agents");
  if (existsSync(join(agentsRepo, "agents"))) {
    found.agents = join(agentsRepo, "agents");
    found.senior = join(agentsRepo, "senior", "agents");
    found.claude = join(agentsRepo, "claude");
  } else if (existsSync(join(base, "agents")) && existsSync(join(base, "senior", "agents"))) {
    found.agents = join(base, "agents");
    found.senior = join(base, "senior", "agents");
  }
  const skillsRepo = join(base, "skills");
  if (existsSync(join(skillsRepo, "skills")) && existsSync(join(skillsRepo, "senior", "skills"))) {
    found.skills = join(skillsRepo, "skills");
    found.seniorSkills = join(skillsRepo, "senior", "skills");
    found.commands = join(skillsRepo, "commands");
  } else if (existsSync(join(base, "senior", "skills"))) {
    found.skills = join(base, "skills");
    found.seniorSkills = join(base, "senior", "skills");
    found.commands = join(base, "commands");
  }
  return Object.keys(found).length ? found : null;
}

function discoverRoots() {
  const bases = [];
  const srcIndex = process.argv.indexOf("--src");
  if (srcIndex >= 0 && process.argv[srcIndex + 1]) bases.push(process.argv[srcIndex + 1]);
  if (process.env.XSCRIPTOR_SRC) bases.push(process.env.XSCRIPTOR_SRC);
  bases.push(process.cwd(), PACKAGES_ROOT, WORKSPACE_ROOT);
  for (const base of bases) {
    const found = rootsFrom(base);
    if (!found) continue;
    for (const [key, value] of Object.entries(found)) if (!roots[key]) roots[key] = value;
  }
}

let agentsTmp = null;
let skillsTmp = null;

async function fetchRepo(repo) {
  const url = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${REF}`;
  console.log(`    downloading ${repo}@${REF}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const dir = mkdtempSync(join(tmpdir(), "xscriptor-"));
  const tgz = join(dir, "src.tgz");
  writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));
  try {
    execFileSync("tar", ["-xzf", tgz, "-C", dir, "--strip-components=1"], { stdio: "ignore" });
  } catch {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    execFileSync("git", ["clone", "--depth", "1", "--branch", REF, `https://github.com/${repo}.git`, dir], { stdio: "ignore" });
  }
  rmSync(tgz, { force: true });
  return dir;
}

async function ensureAgents(needClaude = false) {
  const hasClaude = roots.claude && existsSync(roots.claude);
  if (roots.agents && roots.senior && (!needClaude || hasClaude)) return;
  if (!agentsTmp) agentsTmp = await fetchRepo(AGENTS_REPO);
  roots.agents ||= join(agentsTmp, "agents");
  roots.senior ||= join(agentsTmp, "senior", "agents");
  if (needClaude && !hasClaude) roots.claude = join(agentsTmp, "claude");
}

async function ensureSkills() {
  if (roots.skills && roots.seniorSkills && roots.commands) return;
  if (!skillsTmp) skillsTmp = await fetchRepo(SKILLS_REPO);
  roots.skills ||= join(skillsTmp, "skills");
  roots.seniorSkills ||= join(skillsTmp, "senior", "skills");
  roots.commands ||= join(skillsTmp, "commands");
}

function dstPath(target, sub) {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  if (target === "anthropic") return join(home, ".claude", sub);
  if (target === "project") return join(process.cwd(), ".opencode", sub);
  const xdg = process.env.XDG_CONFIG_HOME || join(home, ".config");
  return join(xdg, "opencode", sub);
}

function copySkill(name, srcDir, dstDir, dryRun) {
  const skillSrc = join(srcDir, name);
  const skillDst = join(dstDir, name);
  const skillFile = join(skillSrc, "SKILL.md");
  if (!existsSync(skillFile)) return 0;
  if (!dryRun) mkdirSync(skillDst, { recursive: true });
  if (!dryRun) copyFileSync(skillFile, join(skillDst, "SKILL.md"));
  console.log(`    ${dryRun ? "-" : "+"} ${name}/SKILL.md`);
  let count = 1;
  const refsSrc = join(skillSrc, "references");
  if (!existsSync(refsSrc)) return count;
  const refsDst = join(skillDst, "references");
  if (!dryRun) mkdirSync(refsDst, { recursive: true });
  for (const item of readdirSync(refsSrc)) {
    const s = join(refsSrc, item);
    const d = join(refsDst, item);
    if (!dryRun) copyFileSync(s, d);
    console.log(`      ${dryRun ? "-" : "+"} ${item}`);
    count++;
  }
  return count;
}

function copyTree(srcDir, dstDir, dryRun, filter) {
  if (!existsSync(srcDir)) return 0;
  let count = 0;
  if (!dryRun) mkdirSync(dstDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry);
    const dst = join(dstDir, entry);
    if (statSync(src).isDirectory()) {
      count += copyTree(src, dst, dryRun, filter);
    } else if (!filter || filter(entry)) {
      if (!dryRun) copyFileSync(src, dst);
      count++;
    }
  }
  return count;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) { console.log(HELP); return; }

  const mode = args.includes("--senior") ? "senior"
    : args.includes("--skills") ? "skills"
    : args.includes("--commands") ? "commands"
    : args.includes("--agents") ? "agents"
    : args.includes("--groups") ? "groups"
    : "all";

  const target = args.includes("--anthropic") ? "anthropic"
    : args.includes("--project") ? "project"
    : "opencode";

  const dryRun = args.includes("--dry-run");
  const doAgents = mode === "all" || mode === "agents" || mode === "groups";
  const doSenior = mode === "all" || mode === "senior";
  const doSkills = mode === "all" || mode === "skills";
  const doCommands = mode === "all" || mode === "commands";
  const groupsArg = args.indexOf("--groups");
  const selectedGroups = groupsArg >= 0 ? args[groupsArg + 1].split(",") : AGENT_GROUPS;

  discoverRoots();
  if (target === "anthropic") await ensureAgents(true);
  if (doAgents || doSenior) await ensureAgents();
  if (doSkills || doCommands) await ensureSkills();

  if (args.includes("--list")) {
    console.log("Available agent groups:");
    for (const g of AGENT_GROUPS) {
      const d = roots.agents && join(roots.agents, g);
      const c = d && existsSync(d) ? readdirSync(d).filter(f => f.endsWith(".md")).length : 0;
      console.log(`  ${g.padEnd(25)} ${c} agents`);
    }
    console.log("\nSenior agent groups:");
    for (const g of SENIOR_GROUPS) {
      const d = roots.senior && join(roots.senior, g);
      const c = d && existsSync(d) ? readdirSync(d).filter(f => f.endsWith(".md")).length : 0;
      console.log(`  ${g.padEnd(25)} ${c} agents`);
    }
    console.log(`\nSenior skills: ${SENIOR_SKILLS.length}`);
    const cmds = roots.commands && existsSync(roots.commands)
      ? readdirSync(roots.commands).filter(f => f.endsWith(".md") && f !== "README.md").length : 0;
    console.log(`Commands: ${cmds}`);
    return;
  }

  const agentsDst = dstPath(target, "agents");
  const skillsDst = dstPath(target, "skills");
  const commandsDst = dstPath(target, "commands");
  let total = 0;

  console.log(`==> @xscriptor/ai-agents (mode: ${mode})`);
  console.log(`    → ${agentsDst}`);
  console.log(`    → ${skillsDst}`);
  console.log(`    → ${commandsDst}\n`);

  if (target === "anthropic") {
    if (!roots.claude) throw new Error("Claude Code mirror not found (agents repo claude/)");
    const mirror = roots.claude;
    if (doAgents) {
      console.log("  [Specialized Agents]");
      const specialized = join(mirror, "agents", "xscriptor", "specialized");
      const groups = mode === "groups" ? selectedGroups : AGENT_GROUPS;
      for (const group of groups) {
        const src = join(specialized, group);
        if (!existsSync(src)) { console.log(`    [SKIP] ${group}`); continue; }
        console.log(`    [${group}]`);
        const n = copyTree(src, join(agentsDst, "xscriptor", "specialized", group), dryRun, f => f.endsWith(".md"));
        console.log(`      ${dryRun ? "-" : "+"} ${n} agents`);
        total += n;
      }
    }
    if (doSenior) {
      console.log("  [Senior Agents]");
      const src = join(mirror, "agents", "xscriptor", "senior");
      for (const group of SENIOR_GROUPS) {
        const g = join(src, group);
        if (!existsSync(g)) { console.log(`    [SKIP] ${group}`); continue; }
        console.log(`    [${group}]`);
        const n = copyTree(g, join(agentsDst, "xscriptor", "senior", group), dryRun, f => f.endsWith(".md"));
        console.log(`      ${dryRun ? "-" : "+"} ${n} agents`);
        total += n;
      }
    }
    if (doSkills) {
      console.log("  [Skills]");
      for (const name of readdirSync(join(mirror, "skills"))) {
        const n = copyTree(join(mirror, "skills", name), join(skillsDst, name), dryRun);
        console.log(`    [${name}] ${dryRun ? "-" : "+"} ${n} files`);
        total += n;
      }
    }
    if (doCommands) {
      console.log("  [Commands]");
      const src = join(mirror, "commands");
      for (const f of readdirSync(src).filter(f => f.endsWith(".md") && f !== "README.md")) {
        if (!dryRun) { mkdirSync(commandsDst, { recursive: true }); copyFileSync(join(src, f), join(commandsDst, f)); }
        console.log(`    ${dryRun ? "-" : "+"} ${f}`);
        total++;
      }
    }
    console.log(dryRun ? `\n==> Would install ${total} items` : `\n==> ${total} items installed`);
    return;
  }

  if (doAgents) {
    if (!roots.agents) throw new Error("agents repo sources not found");
    console.log("  [Specialized Agents]");
    const groups = mode === "groups" ? selectedGroups : AGENT_GROUPS;
    for (const group of groups) {
      const gs = join(roots.agents, group);
      if (!existsSync(gs)) { console.log(`    [SKIP] ${group}`); continue; }
      const files = readdirSync(gs).filter(f => f.endsWith(".md"));
      if (files.length === 0) { console.log(`    [SKIP] ${group} (empty)`); continue; }
      console.log(`    [${group}]`);
      for (const f of files) {
        if (!dryRun) {
          mkdirSync(agentsDst, { recursive: true });
          copyFileSync(join(gs, f), join(agentsDst, f));
        }
        console.log(`      ${dryRun ? "-" : "+"} ${f}`);
        total++;
      }
    }
  }

  if (doSenior) {
    if (!roots.senior) throw new Error("senior agents sources not found");
    console.log("  [Senior Agents]");
    for (const group of SENIOR_GROUPS) {
      const gs = join(roots.senior, group);
      if (!existsSync(gs)) { console.log(`    [SKIP] ${group}`); continue; }
      const files = readdirSync(gs).filter(f => f.endsWith(".md"));
      if (files.length === 0) { console.log(`    [SKIP] ${group} (empty)`); continue; }
      console.log(`    [${group}]`);
      for (const f of files) {
        if (!dryRun) {
          mkdirSync(agentsDst, { recursive: true });
          copyFileSync(join(gs, f), join(agentsDst, f));
        }
        console.log(`      ${dryRun ? "-" : "+"} ${f}`);
        total++;
      }
    }
  }

  if (doSkills) {
    if (!roots.skills || !roots.seniorSkills) throw new Error("skills repo sources not found");
    console.log("  [Skills]");
    for (const sk of SKILL_ROUTES) {
      console.log(`    [${sk.name}]`);
      total += copySkill(sk.name, join(roots.skills, sk.src, ".."), skillsDst, dryRun);
    }
    console.log("    [senior]");
    for (const sk of SENIOR_SKILLS) {
      const cnt = copySkill(sk, roots.seniorSkills, skillsDst, dryRun);
      if (cnt > 0) total += cnt;
    }
  }

  if (doCommands) {
    if (!roots.commands) throw new Error("commands sources not found");
    console.log("  [Commands]");
    const files = readdirSync(roots.commands).filter(f => f.endsWith(".md") && f !== "README.md");
    for (const f of files) {
      if (!dryRun) {
        mkdirSync(commandsDst, { recursive: true });
        copyFileSync(join(roots.commands, f), join(commandsDst, f));
      }
      console.log(`    ${dryRun ? "-" : "+"} ${f}`);
      total++;
    }
  }

  console.log(dryRun ? `\n==> Would install ${total} items` : `\n==> ${total} items installed`);
}

main().catch(err => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
