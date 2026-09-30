<h1 align="center">@xscriptor/ai-agents</h1>

<p>205 ready-to-use AI agents + 22 skills + 8 commands for <a href="https://opencode.ai">OpenCode</a> and <a href="https://docs.anthropic.com/en/docs/claude-code/overview">Claude Code</a>.</p>

<p>Includes 181 specialized agents, 24 consolidated senior agents, 4 project skills, 18 deep-reference skills, and 8 custom commands.</p>

<h2>Installation</h2>

<pre><code># Everything (agents + senior + skills + commands) to OpenCode
npx @xscriptor/ai-agents

# Only specialized agents
npx @xscriptor/ai-agents --agents

# Only senior agents
npx @xscriptor/ai-agents --senior

# Only skills
npx @xscriptor/ai-agents --skills

# Only commands
npx @xscriptor/ai-agents --commands

# Skill-enabled agent set (agents wired to the senior skills) instead of the plain agents
npx @xscriptor/ai-agents --bundle
npx @xscriptor/ai-agents --agents --bundle

# Specific groups
npx @xscriptor/ai-agents --groups general,web/security

# To Claude Code
npx @xscriptor/ai-agents --anthropic

# To current project
npx @xscriptor/ai-agents --project

# Use a local checkout of the org repos (or XSCRIPTOR_SRC / XSCRIPTOR_REF)
npx @xscriptor/ai-agents --src /path/to/xscriptor-ai

# Preview
npx @xscriptor/ai-agents --dry-run

# Global npm install
npm install -g @xscriptor/ai-agents
install-agents</code></pre>

<p>This package ships only the installer. Agents come from <a href="https://github.com/xscriptor-ai/agents">xscriptor-ai/agents</a> (<code>agents/</code>, <code>senior/agents/</code>, <code>claude/commands</code>) and skills from <a href="https://github.com/xscriptor-ai/skills">xscriptor-ai/skills</a> (<code>web-fullstack/</code>, <code>senior/</code>), resolved from a local workspace checkout when available and otherwise downloaded from GitHub at install time. <code>--bundle</code> installs the skill-enabled copies from <code>agents/bundle/</code> (specialized + senior agents pre-wired to the senior skills) instead of the plain agent set; it is OpenCode-only.</p>

<h2>Usage</h2>

<pre><code>@code-reviewer review this pull request
@web-vulnerability-hunter test the login endpoint
@incident-response investigate the alert
@senior-fullstack design the architecture</code></pre>

<p>Repo: <a href="https://github.com/xscriptor-ai/packages">github.com/xscriptor-ai/packages</a></p>
