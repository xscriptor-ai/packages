# Xscriptor Packages

npm packages for installing Xscriptor AI agents and skills.

## Contents

Skill packages mirror the layout of the [xscriptor-ai/skills](https://github.com/xscriptor-ai/skills) repository:

```
packages/
├── ai-agents/                                  # @xscriptor/ai-agents (main installer)
└── skills/
    └── web-fullstack/
        ├── portfolio/xscriptor/                # @xscriptor/skill-xscriptor
        ├── devtools/devx/                      # @xscriptor/skill-devx
        ├── platform/samurai/                   # @xscriptor/skill-samurai
        └── design/xglassmorphism/              # @xscriptor/skill-xglassmorphism
```

Each skill package ships only its installer (`bin/install.js`); the skill content
(`SKILL.md` + `references/`) is fetched from `xscriptor-ai/skills` at install
time.

## Install

```bash
# Everything (agents + senior agents + skills + commands)
npx @xscriptor/ai-agents

# A single project skill
npx @xscriptor/skill-xscriptor
npx @xscriptor/skill-devx
npx @xscriptor/skill-samurai
npx @xscriptor/skill-xglassmorphism
```

## Publishing

Publish each package from its own directory, e.g.:

```bash
npm publish packages/skills/web-fullstack/portfolio/xscriptor
npm publish packages/skills/web-fullstack/devtools/devx
npm publish packages/skills/web-fullstack/platform/samurai
npm publish packages/skills/web-fullstack/design/xglassmorphism
```

Full registry: [xscriptor-ai/agents](https://github.com/xscriptor-ai/agents)

## License

MIT
