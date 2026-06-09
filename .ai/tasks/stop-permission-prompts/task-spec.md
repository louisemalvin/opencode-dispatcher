# Task Spec

## Scope

1. **Delete `workflow/AGENTS.md` entirely.** This file is reference-only documentation, not installed by `bin/install.js`, and its presence is confusing. No substitute or replacement file should be created.

2. **Edit `workflow/agents/task-planner.md`** (line 19):
   - Change the template path from `~/.config/opencode/templates/task-artifact-workflow/task-spec.md` to `.ai/templates/task-artifact-workflow/task-spec.md`.
   - Remove the fallback pattern `"by default, or a project `.ai/templates/task-spec.md` override only when one exists"` — since the project-local path is now the default, no fallback is needed.

3. **Edit `workflow/agents/implementer.md`:**
   - Line 12: Remove the `bash: ask` permission line entirely so the implementer inherits the global `"*": "allow"` permission model (which already blocks dangerous commands like `sudo`, `apt`, `rm -rf`, destructive git).
   - Line 28: Change the template path from `~/.config/opencode/templates/task-artifact-workflow/implementation-report.md` to `.ai/templates/task-artifact-workflow/implementation-report.md`.
   - Remove the fallback pattern `"by default, or a project override only when one exists"`.

4. **Edit `workflow/agents/validator.md`** (line 26):
   - Change the template path from `~/.config/opencode/templates/task-artifact-workflow/validation-report.md` to `.ai/templates/task-artifact-workflow/validation-report.md`.
   - Remove the fallback pattern `"by default, or a project override only when one exists"`.

5. **Edit `bin/install.js`** (check function, lines 84-106):
   - Remove `"workflow/AGENTS.md"` from the `referenceFiles` array (line 94).
   - Update the `console.log` message on line 105 to no longer mention `workflow/AGENTS.md` as checked reference material.
   - Keep all other required install payload checks intact.

6. **Edit `README.md`:**
   - Update the "Install safety" section (around line 138) to remove the sentence: `"The repository file workflow/AGENTS.md is checked as package reference material only; it is not copied into your global config by the installer."`
   - Update any other references to `workflow/AGENTS.md` as reference documentation so they no longer appear. If the README references this file elsewhere, remove or reword those references.

7. **Create `.ai/templates/task-artifact-workflow/`** in the project root:
   - Copy the four template files from `workflow/templates/task-artifact-workflow/` into `.ai/templates/task-artifact-workflow/`:
     - `task-spec.md`
     - `implementation-report.md`
     - `documentation-report.md`
     - `validation-report.md`
   - This directory becomes the project-local template source that agents reference, avoiding permission prompts caused by reading from outside the workspace.

## Non-Goals

- Do not change the content or structure of any template files themselves (only copy them to the new location).
- Do not modify any agent behavior, responsibility descriptions, boundaries, or permission models beyond the template path references and `bash: ask` removal.
- Do not change `bin/install.js` install behavior or payload selection — only remove `workflow/AGENTS.md` from the check function's reference list.
- Do not change OpenCode provider config, project `.ai/` initialization behavior, or unrelated workflow files.
- Do not rewrite large sections of `README.md` — only remove the specific mentions of `workflow/AGENTS.md` as reference material.
- Do not publish, commit, or push.

## Acceptance Criteria

- `workflow/AGENTS.md` no longer exists in the repository.
- `workflow/agents/task-planner.md` references `.ai/templates/task-artifact-workflow/task-spec.md` and contains no fallback pattern.
- `workflow/agents/implementer.md` has no `bash: ask` line, references `.ai/templates/task-artifact-workflow/implementation-report.md`, and contains no fallback pattern.
- `workflow/agents/validator.md` references `.ai/templates/task-artifact-workflow/validation-report.md` and contains no fallback pattern.
- `bin/install.js` `check()` function no longer includes `workflow/AGENTS.md` in `referenceFiles` or in its console output.
- `README.md` contains no text referring to `workflow/AGENTS.md` as package reference material.
- `.ai/templates/task-artifact-workflow/` exists and contains `task-spec.md`, `implementation-report.md`, `documentation-report.md`, and `validation-report.md`.
- `npm run check` (or `node ./bin/install.js check`) passes with no errors.
- No agent references a path under `~/.config/opencode/templates/` — all template paths are project-local `.ai/templates/task-artifact-workflow/*`.

## Constraints

- Only the files listed in Scope may be created, edited, or deleted. Do not modify any other workflow agent files, skill files, or project configuration.
- Template files copied to `.ai/templates/task-artifact-workflow/` must be byte-for-byte identical to their `workflow/templates/task-artifact-workflow/` originals. Do not modify template content.
- Preserve all existing permission rules in agent definitions. The only permission changes are: remove `bash: ask` from implementer.md; leave all other `allow`/`deny` rules untouched.
- The fallback pattern language in agent files may vary slightly (`"by default, or a project override only when one exists"` vs `"by default, or a project .ai/templates/task-spec.md override only when one exists"`). Remove whichever variant exists.

## Relevant Files

- `workflow/AGENTS.md` — delete
- `workflow/agents/task-planner.md` — edit line 19: template path and fallback
- `workflow/agents/implementer.md` — edit line 12: remove `bash: ask`; edit line 28: template path and fallback
- `workflow/agents/validator.md` — edit line 26: template path and fallback
- `bin/install.js` — edit check function: remove `workflow/AGENTS.md` from `referenceFiles` and log message
- `README.md` — edit "Install safety" and any other sections referencing `workflow/AGENTS.md`
- `workflow/templates/task-artifact-workflow/task-spec.md` — source for copy
- `workflow/templates/task-artifact-workflow/implementation-report.md` — source for copy
- `workflow/templates/task-artifact-workflow/documentation-report.md` — source for copy
- `workflow/templates/task-artifact-workflow/validation-report.md` — source for copy
- `.ai/templates/task-artifact-workflow/` — create directory with the four template files

## Validation Plan

1. Confirm `workflow/AGENTS.md` no longer exists on disk.
2. Read `workflow/agents/task-planner.md`:
   - Verify the template path is `.ai/templates/task-artifact-workflow/task-spec.md`.
   - Verify no fallback pattern (e.g., `"by default, or a project...override"`) remains on that line.
3. Read `workflow/agents/implementer.md`:
   - Verify no `bash: ask` line exists in the YAML frontmatter.
   - Verify the template path is `.ai/templates/task-artifact-workflow/implementation-report.md`.
   - Verify no fallback pattern remains.
4. Read `workflow/agents/validator.md`:
   - Verify the template path is `.ai/templates/task-artifact-workflow/validation-report.md`.
   - Verify no fallback pattern remains.
5. Read `bin/install.js` check function:
   - Verify `referenceFiles` no longer contains `"workflow/AGENTS.md"`.
   - Verify the console output no longer mentions `workflow/AGENTS.md`.
6. Read `README.md`:
   - Grep for `workflow/AGENTS.md` — confirm zero occurrences.
   - Grep for `reference material` in context of AGENTS.md — confirm no mentions.
7. Verify `.ai/templates/task-artifact-workflow/` directory exists and contains exactly four files: `task-spec.md`, `implementation-report.md`, `documentation-report.md`, `validation-report.md`.
8. Diff each template in `.ai/templates/task-artifact-workflow/` against its counterpart in `workflow/templates/task-artifact-workflow/` — confirm they are identical.
9. Run `npm run check` and confirm exit code 0 with no errors.
10. Run `node ./bin/install.js` with an invalid command (e.g., `node ./bin/install.js bogus`) to verify usage/help still works and does not reference `workflow/AGENTS.md`.
11. Grep all edited agent files (`task-planner.md`, `implementer.md`, `validator.md`) for `~/.config/opencode/templates/` — confirm zero occurrences.
