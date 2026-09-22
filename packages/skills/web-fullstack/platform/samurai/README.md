<h1 align="center">@xscriptor/skill-samurai</h1>

<p>Design system and architecture skill for the Samurai cybersecurity platform. Documents the design language, frontend/backend patterns, database schema and export system conventions.</p>

<h2>Installation</h2>

<pre><code># Install to OpenCode (~/.config/opencode/skills/samurai/)
npx @xscriptor/skill-samurai

# Install to Claude Code (~/.claude/skills/samurai/)
npx @xscriptor/skill-samurai --anthropic

# Preview what will be installed
npx @xscriptor/skill-samurai --dry-run

# Use a local checkout of the skills repo (or XSCRIPTOR_SRC / XSCRIPTOR_SKILLS_DIR)
npx @xscriptor/skill-samurai --src /path/to/xscriptor-ai</code></pre>

<h2>Usage</h2>

<p>Once installed, the skill loads automatically when working on Samurai. Invoke it manually with <code>/samurai</code> in Claude Code or <code>@samurai</code> in OpenCode.</p>

<p>This package ships only the installer. The skill content (<code>SKILL.md</code> plus its <code>references/</code>) is fetched from <a href="https://github.com/xscriptor-ai/skills">xscriptor-ai/skills</a> at install time, so it always matches the current source of truth.</p>

<p>The skill covers:</p>
<ul>
  <li><strong>Architecture</strong> — zero-trust design, API gateway, mTLS and audit logging</li>
  <li><strong>Backend patterns</strong> — repository pattern, middleware pipeline and circuit breaker</li>
  <li><strong>Component patterns</strong> — atomic design, accessibility-first (WCAG 2.1 AA)</li>
  <li><strong>Database schema</strong> — UUID v7, soft deletes, row-level security and audit columns</li>
  <li><strong>Design tokens</strong> — high contrast, color-blind safe and security UX semantics</li>
  <li><strong>Export patterns</strong> — barrel exports and public API surface conventions</li>
</ul>

<h2>Resources</h2>

<ul>
  <li><a href="https://github.com/xscriptor-ai/skills">github.com/xscriptor-ai/skills</a></li>
  <li><a href="https://github.com/xscriptor-ai/packages">github.com/xscriptor-ai/packages</a></li>
  <li><a href="https://dev.xscriptor.com/en/resources/ai/">dev.xscriptor.com/en/resources/ai/</a></li>
</ul>

<hr>

<p><strong>License:</strong> <a href="./LICENSE">MIT</a><br>
<strong>Report issues:</strong> <a href="https://github.com/xscriptor-ai/packages/issues">github.com/xscriptor-ai/packages/issues</a><br>
<strong>Changelog:</strong> <a href="https://github.com/xscriptor-ai/packages/releases">github.com/xscriptor-ai/packages/releases</a></p>
