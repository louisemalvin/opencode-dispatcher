## Source Artifacts / Handoff Context

- **User Intent**: The user observed the implementer agent constructing vague one-line agy prompts with `--dangerously-skip-permissions`. They want the dispatcher workflow fixed so implementer delegates to agy safely and with enough context. Specifically: remove `--dangerously-skip-permissions` from the default agy invocation, and require the implementer to build a rich, bounded prompt that includes the complete task spec, complete persona, and all relevant file contents. If the prompt would be too long for practical command-line usage or agy needs permissions, the implementer must fall back to manual implementation rather than bypassing permissions.
- **Source Context**:
  - `.ai/context.md`: npm project, validation via `npm run check`, agent files in `workflow/agents/`, agy enabled (`agy: enabled` in `## Workflow`).
  - `workflow/agents/implementer.md`: line 22 contains the current agy integration instruction with `--dangerously-skip-permissions`.
  - `docs/configuration.md`: lines 49–77 document agy integration and also mention the dangerous flag.
  - `bin/install.js`: `npm run check` validates agent frontmatter and orchestrator references.
- **Skill Context**: `customize-opencode` skill loaded. Agent changes must preserve valid YAML frontmatter. Users must restart OpenCode after installed config/agent changes.

## Scope

Tighten the implementer agent's agy delegation instructions and update public docs to match. All changes are within two files:

1. **`workflow/agents/implementer.md`** — Rewrite the agy integration instruction (line 22) to:
   - Remove `--dangerously-skip-permissions` entirely. Use `agy --print "<prompt>"` (or equivalent safe invocation without the dangerous flag).
   - Require the constructed prompt to include, at minimum:
     - The implementer's full persona and boundaries (the contents of this agent definition file).
     - The complete task spec path and contents.
     - `.ai/context.md` relevant workflow/test context.
     - Contents of all relevant files listed in the task spec (or explicit file paths with read-before-edit requirements).
     - The exact output/report path (`## Relevant Files` section of the task spec).
     - Verification commands.
     - Constraints and non-goals from the task spec.
     - Stop conditions.
   - Add an explicit length/feasibility gate: if the constructed prompt would exceed practical command-line quoting or length limits, or cannot include the necessary context, the implementer must **not** delegate to agy and must proceed with manual implementation.
   - Add an explicit permissions gate: if agy requires permissions or user approval at runtime, the implementer must **stop and fall back** to manual implementation rather than bypassing permissions. Do not add `--dangerously-skip-permissions` or any equivalent flag.
   - Require the implementer to describe/preview agy delegation in its implementation report (what prompt was constructed, what agy did) and to verify changes after agy finishes.
   - Clarify that agy makes edits via the `--print` mechanism; the implementer is still responsible for verifying the output satisfies the task spec.
   - Preserve the existing fallback: "If agy is not enabled or not available, proceed with the manual implementation steps below."
   - Keep the existing boundary: "Do not modify the agy configuration or toggle. The `agy: enabled` flag in `.ai/context.md` is user-owned."

2. **`docs/configuration.md`** — Update the Agy Integration section (lines 49–77) to:
   - Remove `--dangerously-skip-permissions` from the documented agy invocation (line 60).
   - Document that the implementer constructs a rich prompt with full context (matching the new agent instruction).
   - Document the length-gate and permissions-gate fallback behavior (implementer falls back to manual work rather than truncating context or bypassing permissions).
   - Document that `--print` is the safe mechanism; do not document or recommend any permission-bypassing flags.

## Execution

- implementer

## Non-Goals

- Running agy or testing agy invocation.
- Changing `.ai/context.md` (the `agy: enabled` flag is user-owned and stays as-is).
- Changing model configuration.
- Adding new CLI implementation code.
- Broad workflow redesign.
- Changing other agents (orchestrator, init, etc.) unless they contain contradictory agy instructions that must be aligned. (Check `workflow/agents/init.md` and `workflow/agents/orchestrator.md` — they only reference enabling/disabling agy and routing; they do not document the dangerous flag or prompt construction details.)
- Editing README, CHANGELOG, `docs/agents.md`, or other docs unless they become actively contradictory after the two primary file changes.

## Testable Acceptance Criteria

1. **`workflow/agents/implementer.md`** line 22 (the agy integration instruction) no longer contains the string `--dangerously-skip-permissions`.
2. **`docs/configuration.md`** lines 49–77 (the Agy Integration section) no longer contains the string `--dangerously-skip-permissions`.
3. **`workflow/agents/implementer.md`** explicitly instructs the implementer to stop/fallback rather than bypass agy permissions (contains text forbidding the addition of permission-bypassing flags).
4. **`workflow/agents/implementer.md`** requires the constructed agy prompt to include: complete persona, complete task spec, relevant file contents, output paths, verification commands, constraints/non-goals, and stop conditions. A vague one-line summary is explicitly insufficient.
5. **`workflow/agents/implementer.md`** contains a length/feasibility gate: if the prompt cannot practically include all required context, the implementer must proceed with manual implementation.
6. **`docs/configuration.md`** describes the agy invocation without `--dangerously-skip-permissions` and documents fallback behavior (length-gate, permissions-gate).
7. **`docs/configuration.md`** matches the actual agent behavior described in `workflow/agents/implementer.md` (no contradictory instructions between the two files).
8. **`npm run check`** passes (validates frontmatter integrity and orchestrator cross-references).

### Test File Paths

- `workflow/agents/implementer.md`
- `docs/configuration.md`
- `bin/install.js` (`npm run check` entry point)

## Inspectable Acceptance Criteria

1. The agy integration instruction in `implementer.md` is operationally precise enough for an agent to follow: it states what to include in the prompt, what conditions require fallback, and what must not be done (bypass permissions).
2. The docs in `configuration.md` use plain language that matches the agent behavior without oversimplifying or overpromising (e.g., no claims that agy edits directly with bypassed permissions).
3. YAML frontmatter in `implementer.md` remains valid (description, mode, permission blocks intact; no unsupported fields added).
4. No new unsupported opencode config fields are introduced.
5. The `## Boundaries` section of `implementer.md` (lines 31–38) remains intact or is only extended with agy-specific boundaries that don't contradict existing ones.

## Relevant Files

- `workflow/agents/implementer.md` — primary change target (agy integration instruction, potentially boundaries section)
- `docs/configuration.md` — secondary change target (Agy Integration section)
- `bin/install.js` — read-only; `npm run check` validation gate
- `.ai/context.md` — read-only; confirms agy is enabled, workflow/test conventions
- `workflow/agents/init.md` — read-only; references agy enabling during init interview (verify no contradictory `--dangerously-skip-permissions` instruction exists)
- `workflow/agents/orchestrator.md` — read-only; references agy routing (verify no contradictory `--dangerously-skip-permissions` instruction exists)

## Validation Plan

1. **Structural check**: Run `npm run check` to ensure `implementer.md` frontmatter is valid and orchestrator cross-references are intact.
2. **Grep for dangerous flag**: Confirm no occurrence of `--dangerously-skip-permissions` in `workflow/agents/implementer.md` or `docs/configuration.md`.
3. **Grep for required prompt elements**: Confirm `implementer.md` agy section mentions persona, task spec, relevant file contents, output paths, verification commands, constraints, and stop conditions.
4. **Grep for fallback gates**: Confirm `implementer.md` agy section mentions length/quoting feasibility and permission fallback.
5. **Docs consistency check**: Read `docs/configuration.md` Agy Integration section side-by-side with `implementer.md` agy instruction; confirm no contradictions.

## Open Questions

None. The user handoff provides sufficient direction on all material points: remove the dangerous flag, require rich prompts, define fallback behavior, and keep existing boundaries. No ambiguous or missing decisions remain.
