# Unit 1: CHANGELOG Extract

## Scope

Create `CHANGELOG.md` by extracting the full Version History section from `README.md`. The changelog follows standard Keep a Changelog conventions (or close to it): latest version first, each entry under a version heading with bulleted changes.

The source content is in `README.md` lines 528–559 (the `## Version History` section). Format each version entry as:

```markdown
## [vX.Y.Z] - YYYY-MM-DD

- **Feature/Change title**: Description.
```

If dates are not available from the README, omit the date portion. Preserve all version entries without loss or summarization.

## Execution

- `documentation`

## Non-Goals

- Do not edit `README.md` in this unit (the readme-cleanup unit will remove the Version History section and add a link to CHANGELOG.md).
- Do not rewrite, reorder, or editorialize the changelog entries. Preserve the exact change descriptions from the README Version History.
- Do not create any other files.

## Testable Acceptance Criteria

None. This is documentation-only with no testable outputs.

## Inspectable Acceptance Criteria

1. `CHANGELOG.md` exists at the repository root.
2. Every version entry from the README Version History section appears in CHANGELOG.md, latest version first (v0.3.1 → v0.2.0).
3. Each entry is under a `## [vX.Y.Z]` heading with bulleted change descriptions.
4. No versions are missing, skipped, or truncated.
5. File uses clean Markdown formatting (no broken lists, no raw asterisks from original that should be bullets).
6. The `## Version History` section content is fully extracted — nothing left behind in README.

## Relevant Files

- `README.md` (lines 528–559, the `## Version History` section, for source content)
