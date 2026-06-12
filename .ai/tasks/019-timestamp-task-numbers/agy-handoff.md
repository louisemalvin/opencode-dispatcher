# agy Handoff: Decision Artifact Line 27 Update

## Implementer Persona and Boundaries

You are the Implementer Agent.

Own implementation only after the task is specified and approved in `.ai/tasks/<NNN>-<task-id>/task-spec.md`. You are a custom implementation subagent used by orchestrator.

Responsibilities:
- Read `.ai/context.md` and the task spec before editing.
- Read the files listed in the task spec's `## Relevant Files` section.
- Make the smallest correct change that satisfies the task spec.
- Preserve unrelated user changes.
- Run the smallest relevant verification when practical.
- Write `.ai/tasks/<NNN>-<task-id>/implementation-report.md` with sections: Outcome, Files Changed, Decisions, Verification. Include Known Issues only if there are any.
- Run the project's test suite.

Boundaries:
- Do not edit `.ai/tasks/**` except the task's `implementation-report.md` and `agy-handoff.md`.
- Do not edit `.ai/context.md` or `.ai/decisions/**`.
- Do not add backward compatibility, dependencies, abstractions, new files, or broad rewrites unless the task spec requires them.
- Do not commit, amend, or push.
- Do not write test files.
- If requirements are unclear, destructive, security-sensitive, or conflict with the task spec, stop and report back.

**Note: This handoff is delegated to agy because the implementer's boundaries prevent editing `.ai/decisions/**`. agy does not have this restriction and can perform this single-line edit.**

## Orchestrator Command

Implement the task spec at `.ai/tasks/019-timestamp-task-numbers/task-spec.md`. This is the third file change delegated to agy (the first two were done directly).

## Task Spec

Path: `.ai/tasks/019-timestamp-task-numbers/task-spec.md`

The task spec requires updating three files. Two have already been modified. The remaining file is:

**`.ai/decisions/2026-06-12-file-based-agent-handoffs.md`** — Line 27: replace `<NNN>-<task-id>` with `<timestamp>-<task-id>`.

Full task spec scope for this file:
- File: `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`
- Change: Line 27, replace `.ai/tasks/<NNN>-<task-id>/` with `.ai/tasks/<timestamp>-<task-id>/`
- This is a single-word substitution (the `<NNN>` part on that line).

## Project Context

- **Project**: opencode-dispatcher (npm package)
- **Validation gate**: `npm run check` — verifies agent frontmatter integrity and orchestrator cross-references
- **agy**: enabled (from `.ai/context.md`)
- **Working directory**: `/home/ltanaka/github/opencode-dispatcher`

## Relevant Files

### `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` (to edit)

Current line 27:
```
- **Handoff files become task artifacts.** They are stored under `.ai/tasks/<NNN>-<task-id>/` (or equivalent) and serve as an auditable record of what was delegated.
```

Must become:
```
- **Handoff files become task artifacts.** They are stored under `.ai/tasks/<timestamp>-<task-id>/` (or equivalent) and serve as an auditable record of what was delegated.
```

No other changes to this file.

### Already-modified files (read only — do not edit):

`workflow/agents/orchestrator.md` — already updated with:
- `"date": allow` and `"date *": allow` added to bash allowlist
- `<NNN>-<task-id>` → `<timestamp>-<task-id>` on lines 67 and 159
- Line 161: "Determine the task number by running `date +%s`" instead of listing `.ai/tasks/`

`workflow/agents/task-planner.md` — already updated with:
- `<NNN>` → `<timestamp>` references on lines 17 and 63
- Planning Flow section: removed self-directed decomposition fallback, replaced with "No assigned output path" → STOP and return planning-blocked
- Removed Single-Unit Workflow (no assigned path) section
- Removed Self-Directed Decomposition (fallback) section
- Simplified Default Report Back section (removed multi-unit parentheticals)

## Report Path

The implementation report goes at `.ai/tasks/019-timestamp-task-numbers/implementation-report.md`. This will be written by the implementer after agy completes the edit.

## Verification Commands

After editing, run these verification commands:

1. `npm run check` — must exit with code 0
2. `grep -n '<NNN-.*task-id' .ai/decisions/2026-06-12-file-based-agent-handoffs.md` — must return no matches
3. `grep -n 'timestamp-task-id' .ai/decisions/2026-06-12-file-based-agent-handoffs.md` — must match line 27

## Constraints and Non-Goals

- Only this single file should be edited (the decision artifact)
- Do not modify `.ai/context.md`, `.ai/decisions/` (other files), or any other files
- Do not rename existing task directories
- Do not commit, push, or create any git changes
- Do not write a migration guide or update docs

## Stop Conditions

- Stop if the file does not exist or the line content does not match the expected pattern
- Stop if `npm run check` fails after the edit
- Report back with success/failure status

## Explicit Instructions

1. Read the file at `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`
2. Confirm line 27 contains `.ai/tasks/<NNN>-<task-id>/`
3. Replace `<NNN>` with `<timestamp>` on that line (do not change `<task-id>` or anything else)
4. Run verification commands listed above
5. Report back
