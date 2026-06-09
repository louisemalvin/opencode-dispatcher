# Task Spec

## Scope

- Edit `workflow/agents/implementer.md` — add `bash: "*": allow` to the `permission:` YAML block so the implementer can run test, build, and dev commands without permission prompts.

At the time of writing, the implementer's permission block has no `bash` key:

```yaml
permission:
  edit:
    "*": allow
    ".ai/tasks/**": deny
    ".ai/context.md": deny
    ".ai/decisions/**": deny
    ".ai/tasks/*/implementation-report.md": allow
```

Add `bash` as a top-level key under `permission:` with `"*": allow`, preserving existing indentation (2-space):

```yaml
permission:
  bash:
    "*": allow
  edit:
    "*": allow
    ".ai/tasks/**": deny
    ".ai/context.md": deny
    ".ai/decisions/**": deny
    ".ai/tasks/*/implementation-report.md": allow
```

## Non-Goals

- Do not modify any other part of the implementer definition (description, mode, responsibilities, boundaries, report format).
- Do not modify any other agent files.
- Do not modify `bin/install.js`, `README.md`, templates, or any other file.
- Do not change existing `edit:` permission rules.

## Acceptance Criteria

- `workflow/agents/implementer.md` has `bash: "*": allow` as a top-level key under `permission:` in its YAML frontmatter.
- All existing permission rules (the `edit:` block and its sub-rules) remain unchanged.
- All other content in the file (description, mode, hidden, body text) remains unchanged.
- YAML indentation is consistent (2-space) and the file parses as valid YAML frontmatter.

## Constraints

- Only edit the permission block YAML in `workflow/agents/implementer.md`.
- Preserve YAML formatting and indentation (2-space).
- Place the new `bash:` key before `edit:` (alphabetical ordering within the `permission:` block).

## Relevant Files

- `workflow/agents/implementer.md` — add `bash: "*": allow` to the permission block.

## Validation Plan

1. Read `workflow/agents/implementer.md` and confirm the `permission:` block now contains `bash: "*": allow` as a top-level key.
2. Confirm the `edit:` block and its sub-rules are unchanged from their pre-edit state.
3. Confirm body text (description, mode, hidden, responsibility lines, boundaries, report format) is unchanged.
4. Confirm the YAML frontmatter (between `---` markers) parses without errors — e.g., strip frontmatter and validate with a YAML-aware tool or manual visual inspection.
