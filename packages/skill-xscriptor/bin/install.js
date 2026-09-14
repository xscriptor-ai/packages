#!/usr/bin/env node
// @xscriptor/skill-xscriptor - Install the Xscriptor design skill.
// Usage: npx @xscriptor/skill-xscriptor [--opencode|--anthropic|--dry-run]
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
const SKILL_NAME = "xscriptor";
const SKILL_REL = join("web", "literature", "xscriptor");
const REF = process.env.XSCRIPTOR_REF || "main";

function dstPath(target) {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  if (target === "anthropic") return join(home, ".claude", "skills", SKILL_NAME);
  const xdg = process.env.XDG_CONFIG_HOME || join(home, ".config");
  return join(xdg, "opencode", "skills", SKILL_NAME);
}

function bases() {
  const list = [];
  const srcIndex = process.argv.indexOf("--src");
  if (srcIndex >= 0 && process.argv[srcIndex + 1]) list.push(process.argv[srcIndex + 1]);
  if (process.env.XSCRIPTOR_SRC) list.push(process.env.XSCRIPTOR_SRC);
  if (process.env.XSCRIPTOR_SKILLS_DIR) list.push(process.env.XSCRIPTOR_SKILLS_DIR);
  if (process.env.XSCRIPTOR_AGENTS_DIR) list.push(process.env.XSCRIPTOR_AGENTS_DIR);
  list.push(PACKAGES_ROOT, WORKSPACE_ROOT);
  return list;
}

function localSource(target) {
  if (target === "anthropic") {
    const paths = [];
    for (const base of bases()) {
      paths.push(join(base, "claude", "skills", SKILL_NAME));
      paths.push(join(base, "agents", "claude", "skills", SKILL_NAME));
    }
    return paths.find(p => existsSync(p));
  }
  const paths = [join(PKG_DIR, "skills", SKILL_REL)];
  for (const base of bases()) {
    paths.push(join(base, "skills", SKILL_REL));
    paths.push(join(base, "skills", "skills", SKILL_REL));
  }
  return paths.find(p => existsSync(p));
}

async function fetchRepo(repo) {
  const url = `https://codeload.github.com/xscriptor-ai/${repo}/tar.gz/refs/heads/${REF}`;
  console.log(`  downloading xscriptor-ai/${repo}@${REF}`);
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
    execFileSync("git", ["clone", "--depth", "1", "--branch", REF, `https://github.com/xscriptor-ai/${repo}.git`, dir], { stdio: "ignore" });
  }
  rmSync(tgz, { force: true });
  return dir;
}

async function remoteSource(target) {
  if (target === "anthropic") {
    const dir = await fetchRepo("agents");
    return join(dir, "claude", "skills", SKILL_NAME);
  }
  const dir = await fetchRepo("skills");
  return join(dir, "skills", SKILL_REL);
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

  console.log(`==> @xscriptor/skill-xscriptor -> ${dst}\n`);
  const c = copyDir(src, dst, dryRun);
  console.log(dryRun ? `\n==> Would install ${c} files` : `\n==> ${c} files installed`);
}

main().catch(err => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
