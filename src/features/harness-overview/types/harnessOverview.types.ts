/** A helper skill or automatic check shown beside a loop stage. */
export interface HarnessHelper {
  /** Skill folder name, or a plain label for a non-skill check. */
  name: string;
  summary: string;
  /** True when `name` is a folder in `.agents/skills`. */
  isSkill: boolean;
}

/** One step of the product-owner loop. */
export interface HarnessStage {
  skill: string;
  title: string;
  summary: string;
  /** Set where the owner steps in; the text is the stop label. */
  ownerStop?: string;
  /** Short label on the arrow leaving this stage. */
  handoff?: string;
  helpers: HarnessHelper[];
}

export interface HarnessOutcome {
  title: "Pass" | "Change" | "Drop";
  summary: string;
}

export interface HarnessGuardrailGroup {
  title: string;
  items: string[];
}
