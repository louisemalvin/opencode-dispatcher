# Implementation Report: Add Model Variant Support to Model-Config Agent

## Outcome

Successfully updated `workflow/agents/model-config.md` to add model variant discovery, selection, and configuration support. All 11 inspectable acceptance criteria are satisfied.

## Files Changed

- `workflow/agents/model-config.md` — the only file modified.

## Changes Made

1. **Model discovery command** (line 22): Changed `opencode models` to `opencode models --verbose` to expose variant data.

2. **Variant discovery and selection step** (line 26): Added new bullet describing:
   - Parsing the `variants` field from verbose output
   - Presenting variant names to the user when variants exist (non-empty object)
   - Silently skipping (no prompt) when a model has no variants (empty `{}`)
   - Not writing a `variant` field if the user skips

3. **Write instruction updated** (lines 27-33): Changed from writing only `agent.<name>.model` to writing both `agent.<name>.model` and optionally `agent.<name>.variant`, with the target JSONC format example included.

4. **Create config updated** (line 34): Extended to include `agent.<name>.variant` where applicable.

5. **Boundaries updated** (lines 42-43): Added two new prohibitions:
   - Do not invent variant names — only use names from `opencode models --verbose` output
   - Do not write a `variant` field for models that have no variants

6. **Default report back updated** (line 48): Changed to include variant assignments in the summary: "models (and variants, when assigned)".

7. **YAML frontmatter**: Preserved byte-for-byte identical to the original.

## Decisions

- Inserted the variant step as a single bullet between "ask which model" and "write entries" per the task spec's requirement for a single bullet (spec item 5).
- Included the JSONC format example inline rather than as a separate section, matching the density of the existing agent definition.
- Kept the existing "preserving all existing config content exactly as-is" language and applied it to variant writing implicitly — the same preservation rule governs both model and variant fields.

## Verification

- **git diff**: Only `workflow/agents/model-config.md` shows as modified.
- **YAML frontmatter**: Unchanged (lines 1-14 match original exactly).
- **All inspectable acceptance criteria verified**:
  1. `opencode models --verbose` replaces `opencode models`
  2. Variant discovery step exists with parsing, presentation, and skip logic
  3. Variant selection step exists (pick or skip before writing)
  4. `agent.<name>.variant` write instruction with target JSONC format
  5. Config preservation rule covers variant
  6. Graceful handling of no-variant models (empty `{}` = skip silently)
  7. YAML frontmatter unchanged
  8. Boundaries updated with two variant-related prohibitions
  9. Default report back includes variant assignments
  10. No other files modified
  11. Tone, structure, and density match existing agents (short frontmatter, bullet lists, concise sections)
- **No executable tests exist for this task** (it modifies an agent definition markdown file).

## Known Issues

None.
