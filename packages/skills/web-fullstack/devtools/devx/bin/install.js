#!/usr/bin/env node
// @xscriptor/skill-devx - Install the DevX development skill.
// Usage: npx @xscriptor/skill-devx [--opencode|--anthropic|--dry-run] [--src DIR]
import {
  existsSync, mkdirSync, copyFileSync, readdirSync, statSync,
  writeFileSync, mkdtempSync, rmSync,
} from "fs";
import { execFileSync } from "child_process";
import { join, dirname } from "path";
import { tmpdir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_NAME = "devx";
// Location of this skill inside the xscriptor-ai/skills repository.
const SKILL_REL = join("web-fullstack", "devtools", "devx");
const REF = process.env.XSCRIPTOR_REF || "main";
const SKILLS_REPO = "xscriptor-ai/skills";
const AGENTS_REPO = "xscriptor-ai/agents";

function dstPath(target) {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  if (target === "anthropic") return join(home, ".claude", "skills", SKILL_NAME);
  const xdg = process.env.XDG_CONFIG_HOME || join(home, ".config");
  return join(xdg, "opencode", "skills", SKILL_NAME);
}

// Walk up from this file until we find the packages repo root (.git).
function repoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirname(dirname(__dirname));
}

function bases() {
  const list = [];
  const srcIndex = process.argv.indexOf("--src");
  if (srcIndex >= 0 && process.argv[srcIndex + 1]) list.push(process.argv[srcIndex + 1]);
  if (process.env.XSCRIPTOR_SRC) list.push(process.env.XSCRIPTOR_SRC);
  if (process.env.XSCRIPTOR_SKILLS_DIR) list.push(process.env.XSCRIPTOR_SKILLS_DIR);
  if (process.env.XSCRIPTOR_AGENTS_DIR) list.push(process.env.XSCRIPTOR_AGENTS_DIR);
  const root = repoRoot();
  list.push(root);                       // skills repo nested at repo root
  list.push(join(root, ".."));           // sibling checkout: <workspace>/skills
  list.push(join(root, "..", ".."));
  list.push(process.cwd());
  return list;
}

function localSource(target) {
  for (const base of bases()) {
    if (target === "anthropic") {
      const found = [
        join(base, "claude", "skills", SKILL_NAME),
        join(base, "agents", "claude", "skills", SKILL_NAME),
      ].find(existsSync);
      if (found) return found;
    } else {
      const found = [
        join(base, SKILL_REL),            // base is the skills repo itself
        join(base, "skills", SKILL_REL),  // base is a workspace containing skills/
      ].find(existsSync);
      if (found) return found;
    }
  }
  return undefined;
}

async function fetchRepo(repo) {
  const url = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${REF}`;
  console.log(`  downloading ${repo}@${REF}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const dir = mkdtempSync(join(tmpdir(), "xscriptor-skill-"));
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

async function remoteSource(target) {
  if (target === "anthropic") {
    const dir = await fetchRepo(AGENTS_REPO);
    return join(dir, "claude", "skills", SKILL_NAME);
  }
  const dir = await fetchRepo(SKILLS_REPO);
  return join(dir, SKILL_REL);
}

function copyDir(s, d, dry) {
  let c = 0;
  for (const e of readdirSync(s)) {
    const sp = join(s, e), dp = join(d, e);
    if (statSync(sp).isDirectory()) { if (!dry) mkdirSync(dp, { recursive: true }); c += copyDir(sp, dp, dry); }
    else if (e.endsWith(".md") || e.endsWith(".json")) {
      if (!dry) { mkdirSync(d, { recursive: true }); copyFileSync(sp, dp); }
      console.log(`  ${dry ? "-" : "+"} ${e}`); c++;
    }
  }
  return c;
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.includes("--anthropic") ? "anthropic" : "opencode";
  const dryRun = args.includes("--dry-run");
  const dst = dstPath(target);
  const src = localSource(target) || await remoteSource(target);

  if (!existsSync(src)) throw new Error(`skill source not found: ${src}`);

  console.log(`==> @xscriptor/skill-devx -> ${dst}\n`);
  const c = copyDir(src, dst, dryRun);
  console.log(dryRun ? `\n==> Would install ${c} files` : `\n==> ${c} files installed`);
}

main().catch(err => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
