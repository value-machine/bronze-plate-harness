// Steps the user takes outside the repo (app settings, user-level folders). The migration never does these (D12).
// Each step is emitted only when it applies to this inventory.

const code = value => `\`${value}\``;

function mcpStep(inventory) {
  if (!inventory.mcp?.servers?.length) return null;
  return {
    id: 'claude-approve-mcp',
    tool: 'Claude Code',
    title: 'Approve the project MCP servers',
    steps: [
      'Set the variables listed in `.env.example` in your shell or `.env` first.',
      `Start Claude Code in the repo. It asks once per server in \`.mcp.json\` (${inventory.mcp.servers.map(s => code(s.name)).join(', ')}); approve the ones you use.`,
      'Run `/mcp` to see each server\'s status.',
    ],
  };
}

function contextStep() {
  return {
    id: 'claude-check-context',
    tool: 'Claude Code',
    title: 'Check what loads',
    steps: [
      'Open a new Claude Code session in the repo and run `/context`. Memory files should list `CLAUDE.md`, `AGENTS.md` and the always-on rules from `.claude/rules`.',
      'Run `/skills`. Each repo skill should appear once.',
      'Open a file that matches a path-scoped rule; that rule should load then, not at launch.',
    ],
  };
}

function shadowStep(user) {
  if (user.shadowedSkills.length === 0) return null;
  const identical = user.shadowedSkills.filter(s => s.identical).map(s => code(s.name));
  const different = user.shadowedSkills.filter(s => !s.identical).map(s => code(s.name));
  return {
    id: 'personal-skills-shadow',
    tool: 'Claude Code',
    title: 'Personal skills hide repo skills with the same name',
    steps: [
      'Claude Code runs a personal skill (`~/.claude/skills/<name>`) instead of a repo skill with the same name, so the repo version never loads on this machine.',
      ...(different.length ? [`Different from the repo version: ${different.join(', ')}.`] : []),
      ...(identical.length ? [`Same as the repo version (safe to delete): ${identical.join(', ')}.`] : []),
      'Per skill, choose: delete the personal copy (the repo version loads), rename it (both load; the personal one under the new name), or keep it (the repo version stays hidden for you).',
      '`~/.claude/skills` is shared by every project on this machine. Check other repos before deleting.',
    ],
  };
}

function cursorUserRulesStep() {
  return {
    id: 'cursor-user-rules',
    tool: 'Cursor',
    title: 'Copy personal User Rules by hand',
    steps: [
      'Cursor Settings → Rules → User Rules live in Cursor, not in the repo, so they were not migrated.',
      'Copy the ones you want in Claude Code into `~/.claude/CLAUDE.md` (all your projects) or this repo\'s `CLAUDE.md` (this project only).',
    ],
  };
}

function cursorThirdPartyStep(inventory) {
  if (!inventory.keepCursor) return null;
  return {
    id: 'cursor-third-party-configs',
    tool: 'Cursor',
    title: 'Third-party configs toggle',
    steps: [
      'Cursor Settings → "Include third-party Plugins, Skills, and other configs" decides whether Cursor also reads Claude Code config such as `.claude/skills`.',
      'Either setting works here: `.claude/skills` is an exact copy of `.agents/skills`, and Cursor shows a skill found in both once.',
    ],
  };
}

function cursorUserDuplicatesStep(user) {
  if (user.cursorUserDuplicates.length === 0) return null;
  return {
    id: 'cursor-user-duplicates',
    tool: 'Cursor',
    title: 'Skills listed twice in Cursor',
    steps: [
      `These skills exist in both \`~/.agents/skills\` and \`~/.cursor/skills-cursor\`: ${user.cursorUserDuplicates.map(code).join(', ')}.`,
      'Cursor does not merge user-level folders, so each shows twice. `~/.cursor/skills-cursor` is managed by Cursor; remove the copy in `~/.agents/skills` if you did not put it there on purpose.',
    ],
  };
}

function cloudStep() {
  return {
    id: 'claude-cloud-sessions',
    tool: 'Claude Code',
    title: 'Cloud sessions',
    steps: [
      'Claude Code cloud sessions load the repo\'s `CLAUDE.md`, `.claude/rules` and `.claude/skills`, but not plugins. The migrated setup lives in repo files, so it works there; this plugin itself is only needed to migrate.',
    ],
  };
}

export function buildGuidedSteps(inventory) {
  return [
    mcpStep(inventory),
    contextStep(),
    shadowStep(inventory.userConfig),
    cloudStep(),
    cursorUserRulesStep(),
    cursorThirdPartyStep(inventory),
    cursorUserDuplicatesStep(inventory.userConfig),
  ].filter(Boolean);
}
