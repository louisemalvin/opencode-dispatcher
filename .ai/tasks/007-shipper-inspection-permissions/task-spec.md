# Task Spec: 007-shipper-inspection-permissions

## Scope

Fix two problems in the Dispatcher shipper agent and resolve a contradictory `.ai/context.md` convention:

1. **Shipper permission prompts on harmless inspection commands**: The shipper's `bash: "*": ask` catch-all triggers unnecessary permission prompts for read-only inspection commands (`grep`, `head`, `tail`, `cat`, `wc`, `file`, `git show`, `node -p`). Add narrow `allow` rules for these safe read-only commands so pre-commit inspection flows without prompts, while preserving all existing denials for destructive and deployment actions. **Shell pipelines (`|`, `&&`, `||`, `;`) are not allowed** — the shipper runs each inspection command individually rather than chaining them. For example, `grep ...` and `head -5 ...` are separate commands, not `grep ... | head -5`.

2. **Shipper must not prepare version bump edits or README edits**: The shipper's body text currently says "Do not prepare changes; only commit or push existing intended changes" but this is too vague. Some users have observed the shipper attempting to update `README.md` Version History during version bumps. Add explicit prohibitions in the shipper's body text that version bump preparation, README edits, and changelog updates are out of scope for shipper and must be prepared by other agents (implementer, executor, documentation) before shipper is invoked.

3. **Resolve `.ai/context.md` Version History contradiction**: Line 18 says "Every version bump commit must also update `README.md` Version History" (which could be read as shipper's responsibility) while line 25 says "prepare ... before invoking shipper." Harmonize both lines so they consistently state: README Version History updates must be prepared before the commit, never by shipper.

4. **task-planner must not emit explanatory orchestration notes in `## Execution`**: Execution sections produced by task-planner shall be only bullet lists of valid execution agents (`test-writer`, `implementer`, `documentation`) and shall not contain any explanatory orchestration notes.

## Execution

- implementer

## Non-Goals

- Do not modify any other agent files (`orchestrator`, `implementer`, `validator`, `executor`, `documentation`, `test-writer`, `init`, `model-config`, `research`, or any other agent).
- Do not change `bin/install.js`, `package.json`, `README.md`, templates, or any skill files.
- Do not change the permission model for any agent other than shipper.
- Do not remove or weaken any existing deny rules in the shipper's frontmatter.
- Do not change how `npm run check` validates agent files.
- Do not add, remove, or reorder the shipper's hard boundaries or commit message rules beyond the explicit additions described in this spec.
- Do not implement, commit, push, or publish.

## Testable Acceptance Criteria

1. **`grep` allowed without prompt**: The shipper's YAML frontmatter contains `"grep *": allow`. Running `grep -n "## Version History" README.md` (as a standalone command, not piped) under the shipper context does not trigger a permission prompt.

2. **`head` allowed without prompt**: The shipper's YAML frontmatter contains `"head *": allow`. Running `head -5 README.md` under the shipper context does not trigger a permission prompt.

3. **`git show` allowed without prompt**: The shipper's YAML frontmatter contains `"git show*": allow`. Running `git show --stat HEAD` under the shipper context does not trigger a permission prompt.

4. **`node -p` allowed without prompt**: The shipper's YAML frontmatter contains `"node -p *": allow`. Running `node -p "require('./package.json').version"` under the shipper context does not trigger a permission prompt. Broader `node *` (which could invoke arbitrary scripts or `node -e` side-effect code) remains under the `"*": ask` catch-all.

5. **`cat`, `tail`, `wc`, `file` allowed without prompt**: The shipper's YAML frontmatter contains `"cat *": allow`, `"tail *": allow`, `"wc *": allow`, and `"file *": allow`.

6. **`npm run check` passes**: Running `npm run check` exits with code 0 and reports no errors.

7. **Only target files modified**: `git diff --name-only` (on a clean baseline) shows only `workflow/agents/shipper.md`, `workflow/agents/task-planner.md`, and `.ai/context.md`.

8. **All pre-existing denies preserved**: Every deny rule in the shipper's frontmatter (`git reset*`, `git rebase*`, `git clean*`, `git tag*`, `git commit -a*`, `git commit -am*`, `git commit * -a*`, `git commit * -am*`, `git commit *--amend*`, `git push *--force*`, `git push *-f*`, `git push *--delete*`, `gh pr*`, `npm run deploy*`, `pnpm deploy*`, `yarn deploy*`, `amplify publish*`) remains present, unaltered, with the value `deny`.

9. **Shipper body text explicitly prohibits version bump and README edits**: The shipper's body text contains language stating that version bump preparation, README.md edits, and changelog updates are out of scope for the shipper agent and must be prepared by other agents (implementer, executor, documentation) before shipper is invoked.

10. **Shipper body text explicitly discourages shell pipelines**: The shipper's body text contains language stating that inspection commands must be run individually — not combined with shell operators such as pipes (`|`), `&&`, `||`, or `;`. This extends the existing "Do not combine allowed commands with shell operators" guidance (current line 69).

11. **`.ai/context.md` no longer implies shipper responsibility for README edits**: Both line 18 (version bump commit convention) and line 25 (version bump preparation) consistently state that README Version History updates must be prepared before invoking shipper, not by shipper itself.

12. **task-planner.md instructs planners to keep `## Execution` clean**: `workflow/agents/task-planner.md` tells planners that execution sections must be only a bullet list of valid execution agents (`test-writer`, `implementer`, `documentation`) with no explanatory orchestration notes.

### Test File Paths

- `workflow/agents/shipper.md` — visual inspection of bash permission block for the eight new `allow` rules and body text for explicit version-bump/README prohibitions.
- `.ai/context.md` — visual inspection of lines 18 and 25 for harmonized version bump convention.
- `npm run check` — automated validation gate.

## Inspectable Acceptance Criteria

- The eight new `allow` rules in `shipper.md` (`grep *`, `head *`, `tail *`, `cat *`, `wc *`, `file *`, `git show*`, `node -p *`) are inserted in the `allow` group of the bash permission block, after the existing `npm run check *` line and before the first deny rule (`git reset*: deny`).
- No existing permission rule is removed, reworded, or reordered in the shipper.md frontmatter.
- The shipper's body text additions are placed after the existing "Do not prepare changes" line (line 57) or in the Hard boundaries section, expanding it with: (a) explicit prohibitions against version bump edits, README edits, and changelog updates; and (b) explicit guidance that inspection commands must be run individually, never combined with shell operators (`|`, `&&`, `||`, `;`).
- `.ai/context.md` line 18 is reworded to indicate that README Version History updates must be included in version bump commits but prepared before the commit (not by shipper).
- `.ai/context.md` line 25 is either left as-is (already correct) or lightly reworded for consistency with the updated line 18.
- Shell pipelines (`|`, `&&`, `||`, `;`) are disallowed by shipper instructions. Each inspection command is run individually — e.g., `grep -n ... README.md` and `head -5 ...` are separate invocations, never combined. Existing deny rules provide defense-in-depth against destructive command chaining for any pipeline that escapes the instruction boundary.
- `workflow/agents/task-planner.md` instructs planners that `## Execution` sections must contain only a bullet list of valid execution agents (`test-writer`, `implementer`, `documentation`) with no explanatory orchestration notes.

## Relevant Files

- `workflow/agents/shipper.md` — bash permission frontmatter block (lines 7–43) and body text (lines 46–96). Target for new `allow` rules and explicit README/edit prohibitions.
- `.ai/context.md` — "Conventions" section lines 18 and 25. Target for harmonized version bump convention language.
- `workflow/agents/task-planner.md` — instructions for generating `## Execution` sections; must be updated to keep execution sections as bare bullet lists of valid execution agents (`test-writer`, `implementer`, `documentation`) with no orchestration notes.
