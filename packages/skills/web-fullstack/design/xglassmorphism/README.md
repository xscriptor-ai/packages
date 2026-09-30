<h1 align="center">@xscriptor/skill-xglassmorphism</h1>

<p>Real glassmorphism skill for TypeScript + CSS web applications, with Tauri 2.x packaging where native window effects apply. Covers the optics of frosted glass, <code>backdrop-filter</code>, layered surfaces, design tokens, typed components, accessibility, performance, browser support and fullstack architecture.</p>

<h2>Installation</h2>

<pre><code># Install to OpenCode (~/.config/opencode/skills/xglassmorphism/)
npx @xscriptor/skill-xglassmorphism

# Install to Claude Code (~/.claude/skills/xglassmorphism/)
npx @xscriptor/skill-xglassmorphism --anthropic

# Preview what will be installed
npx @xscriptor/skill-xglassmorphism --dry-run

# Use a local checkout of the skills repo (or XSCRIPTOR_SRC / XSCRIPTOR_SKILLS_DIR)
npx @xscriptor/skill-xglassmorphism --src /path/to/xscriptor-ai</code></pre>

<h2>Usage</h2>

<p>Once installed, the skill loads automatically when working on glass UI. Invoke it manually with <code>/xglassmorphism</code> in Claude Code or <code>@xglassmorphism</code> in OpenCode.</p>

<p>This package ships only the installer. The skill content (<code>SKILL.md</code> plus its <code>references/</code>) is fetched from <a href="https://github.com/xscriptor-ai/skills">xscriptor-ai/skills</a> at install time, so it always matches the current source of truth.</p>

<p>The skill covers:</p>
<ul>
  <li><strong>Physics of glass</strong> — blur, tint, saturation, specular edges, noise and depth</li>
  <li><strong>CSS implementation</strong> — <code>backdrop-filter</code> mechanics, backdrop roots, clipping, masks and fallbacks</li>
  <li><strong>Design tokens and theming</strong> — light/dark theming and the TypeScript token contract</li>
  <li><strong>Typed components</strong> — React 19, Vue 3, Svelte 5, vanilla TS and Web Components</li>
  <li><strong>Accessibility</strong> — WCAG contrast over worst-case backdrops, reduced transparency/motion, forced colors</li>
  <li><strong>Performance</strong> — budgets, engine bug catalog and the 2026 browser support matrix</li>
  <li><strong>Fullstack architecture</strong> — SSR, theme persistence API, admin preview, visual regression and CI</li>
  <li><strong>Tauri 2.x</strong> — native vibrancy vs CSS glass, <code>windowEffects</code>, drag regions and packaging</li>
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
