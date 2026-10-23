// User-level agent config (read only, never written: D12). Personal skills can shadow the repo's skills.
import {homedir} from 'node:os';

import {exists, listDirs, readBytes, sha256} from '../lib/fs-utils.mjs';

const CLAUDE_SKILLS = '.claude/skills';
const AGENTS_SKILLS = '.agents/skills';
const CURSOR_SKILLS = '.cursor/skills-cursor';

/** Home folder to inspect. CURSOR_MIGRATION_HOME overrides it (tests point it at an empty folder). */
export function userHome() {
  return process.env.CURSOR_MIGRATION_HOME || homedir();
}

function skillHash(root, dir, name) {
  const file = `${dir}/${name}/SKILL.md`;
  return exists(root, file) ? sha256(readBytes(root, file)) : null;
}

/** Hash of a project skill's SKILL.md: the neutral source first, then a Cursor skill folder. */
function projectSkillHash(root, name) {
  return skillHash(root, AGENTS_SKILLS, name) ?? skillHash(root, '.cursor/skills', name);
}

/**
 * Personal skills that share a name with a project skill. Claude Code runs the personal one
 * (personal skills win over project skills), so the repo's version never loads on that machine.
 */
function findShadows(root, home, projectSkillNames) {
  return listDirs(home, CLAUDE_SKILLS)
    .filter(name => projectSkillNames.has(name))
    .map(name => {
      const personal = skillHash(home, CLAUDE_SKILLS, name);
      return {name, identical: personal !== null && personal === projectSkillHash(root, name)};
    });
}

/** Cursor does not dedupe skills across its user-level folders, so these show twice. */
function findCursorUserDuplicates(home) {
  const cursorNames = new Set(listDirs(home, CURSOR_SKILLS));
  return listDirs(home, AGENTS_SKILLS).filter(name => cursorNames.has(name));
}

export function readUserConfig(root, projectSkillNames, home = userHome()) {
  return {
    shadowedSkills: findShadows(root, home, projectSkillNames),
    cursorUserDuplicates: findCursorUserDuplicates(home),
  };
}
