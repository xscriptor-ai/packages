<h1 align="center">@xscriptor/skill-xscriptor</h1>

<p>Full design and development skill for the Xscriptor literary portfolio site (<a href="https://xscriptor.com">xscriptor.com</a>). Documents the complete architecture, design system, component catalog, content pipeline, book-reader engines, i18n and build/deploy of the site — built with Next.js 16 App Router, Tailwind CSS v4, a static export and five locales.</p>

<h2>Installation</h2>

<pre><code># Install to OpenCode (~/.config/opencode/skills/xscriptor/)
npx @xscriptor/skill-xscriptor

# Install to Claude Code (~/.claude/skills/xscriptor/)
npx @xscriptor/skill-xscriptor --anthropic

# Preview what will be installed
npx @xscriptor/skill-xscriptor --dry-run

# Use a local checkout of the skills repo (or XSCRIPTOR_SRC / XSCRIPTOR_SKILLS_DIR)
npx @xscriptor/skill-xscriptor --src /path/to/xscriptor-ai</code></pre>

<h2>Usage</h2>

<p>Once installed, the skill loads automatically when working on the Xscriptor project. Invoke it manually with <code>/xscriptor</code> in Claude Code or <code>@xscriptor</code> in OpenCode.</p>

<p>This package ships only the installer. The skill content (<code>SKILL.md</code> plus its <code>references/</code>) is fetched from <a href="https://github.com/xscriptor-ai/skills">xscriptor-ai/skills</a> at install time, so it always matches the current source of truth.</p>

<p>The skill covers:</p>
<ul>
  <li><strong>Design intent and design system</strong> — color tokens, EB Garamond typography, marker chips, glass and neumorphic surfaces, motion language, accessibility</li>
  <li><strong>Architecture</strong> — static export, server/client boundary and the <code>"use client"</code> barrel, route map, providers</li>
  <li><strong>i18n</strong> — five languages (es, en, de, it, fr) with the custom provider and <code>getMsg</code></li>
  <li><strong>Component catalog</strong> — <code>@xscriptor/xcomponents</code> npm components plus every local component</li>
  <li><strong>Content pipeline</strong> — blog markdown to KaTeX/highlight, MDX books, <code>poemParser</code>, message files and <code>WordConfig</code></li>
  <li><strong>Book readers</strong> — the four reader engines and their parsing/pagination algorithms</li>
  <li><strong>Build and deploy</strong> — <code>next-sitemap</code>, <code>.htaccess</code> / <code>_headers</code>, static hosting</li>
  <li><strong>Code structure</strong> — placement rules, responsibilities, anti-patterns and known debt</li>
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
