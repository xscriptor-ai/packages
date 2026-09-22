<h1 align="center">@xscriptor/skill-devx</h1>

<p>Design and structure skill for the DevX UI (the <code>dev.xscriptor.com</code> resources pages). Documents the visual system, design tokens, typography, layout, motion, accessibility and code organization conventions.</p>

<h2>Installation</h2>

<pre><code># Install to OpenCode (~/.config/opencode/skills/devx/)
npx @xscriptor/skill-devx

# Install to Claude Code (~/.claude/skills/devx/)
npx @xscriptor/skill-devx --anthropic

# Preview what will be installed
npx @xscriptor/skill-devx --dry-run

# Use a local checkout of the skills repo (or XSCRIPTOR_SRC / XSCRIPTOR_SKILLS_DIR)
npx @xscriptor/skill-devx --src /path/to/xscriptor-ai</code></pre>

<h2>Usage</h2>

<p>Once installed, the skill loads automatically when working on DevX pages. Invoke it manually with <code>/devx</code> in Claude Code or <code>@devx</code> in OpenCode.</p>

<p>This package ships only the installer. The skill content (<code>SKILL.md</code> plus its <code>references/</code>) is fetched from <a href="https://github.com/xscriptor-ai/skills">xscriptor-ai/skills</a> at install time, so it always matches the current source of truth.</p>

<p>The skill covers:</p>
<ul>
  <li><strong>Design system</strong> — visual language, tokens, typography and elevation</li>
  <li><strong>Layout</strong> — responsive grid, breakpoints and container patterns</li>
  <li><strong>Motion</strong> — transitions and interaction feedback</li>
  <li><strong>Accessibility</strong> — contrast, focus and semantics</li>
  <li><strong>Code structure</strong> — module conventions, barrel exports and internal directories</li>
  <li><strong>Platform mapping</strong> — web, mobile and API conventions</li>
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
