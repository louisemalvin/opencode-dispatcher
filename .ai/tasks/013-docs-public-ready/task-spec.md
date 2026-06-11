# Scope

Targeted documentation and package metadata changes to make the `opencode-dispatcher` npm package ready for its first public release. This task addresses P0/P1/P2 findings from the validated documentation audit (`.ai/tasks/012-doc-audit/documentation-report.md`).

Changes are grouped into four work streams, all implemented across the same set of files:

1. **P0 — npm README link safety and package inclusion**: Add missing published files to `package.json` `"files"` so npm README relative links resolve. Convert "Further Reading" links in README to absolute GitHub blob URLs so they work on both GitHub and the npm registry.

2. **P1 — Prerequisites and jargon**: State the OpenCode prerequisite explicitly in README and `package.json`. Replace undefined jargon ("low-context") with plain language in the npm description. Define or cross-link "agy". Add a "who this is for" statement.

3. **P1 — Group-tier documentation clarity**: Update `docs/configuration.md` to explain that the MED/LOW groups are **recommendation tiers** (not hardcoded model assignments). MED agents should generally use a medium reasoning model of the user's choice; LOW agents can use cheaper/lower reasoning models. Add a note that `opencode.jsonc` in the repository is the maintainer's example preset — a ready-to-use starting point that users can override with their own model choices via the model-config agent.

4. **P2 — Minor completeness and deduplication**: Add Node.js minimum version. Add explicit first-invocation guidance to README First Use step 2. Add an install cross-link from README Installation to `docs/configuration.md`. Resolve Project Context duplication between `docs/workflow.md` and `docs/development.md` so one keeps the description and the other cross-references. Shorten the CI auto-publish section in `docs/development.md` to a brief summary with a cross-reference to the workflow YAML.

## Execution

- implementer
- documentation
- validator

## Non-Goals

- No changes to `opencode.jsonc` (it is the maintainer's preset, intentionally a practical starting point).
- No changes to `bin/install.js` or any agent definition files in `workflow/agents/`.
- No changes to `.ai/context.md` or `.github/workflows/publish.yml`.
- No new documentation files.
- No large-scale rewrites of existing documents — preserve current quality and voice.
- No version bump or release step (that is a separate task).

## Testable Acceptance Criteria

1. `npm run check` exits zero (package integrity intact, no agent frontmatter regressions).

2. `package.json` `"files"` array includes `"docs/"`, `"CHANGELOG.md"`, and `"LICENSE"` in addition to the existing entries (`"bin/"`, `"workflow/"`, `"README.md"`).

3. `package.json` `"description"` no longer contains the term `"low-context"`. The new description is in plain language suitable for a first-time npm visitor, referencing durable task artifacts or structured workflows, and briefly situating the package as an OpenCode add-on.

4. Every link in the README `## Further Reading` section uses an **absolute GitHub blob URL** (e.g., `https://github.com/louisemalvin/opencode-dispatcher/blob/master/CHANGELOG.md`), not a relative path. The `## License` link to LICENSE is likewise an absolute URL.

5. An explicit prerequisite statement that OpenCode must be installed appears in the README **before** the installation commands (in the `## Installation` section or a new Prerequisites subsection).

6. README includes a brief "who this is for" statement (e.g., in the opening paragraph or a dedicated line) helping first-time visitors self-select.

7. README `## First Use` step 2 includes a concrete example of what to type or how to invoke the orchestrator for initialization (e.g., a sample prompt).

8. README `## Installation` section includes a cross-link to `docs/configuration.md` install/uninstall details.

9. A Node.js minimum version requirement appears in README (e.g., in Installation or Prerequisites) and in `package.json` `"engines"` field (e.g., `"node": ">=18"` matching CI's `node-version: 24` as the tested floor).

### Test File Paths

- `package.json` — validated via `node -e "const p = require('./package.json'); ..."` for `files` array, `description`, `engines`.
- `npm run check` — validates agent integrity.
- Link checking: manual or automated verification that all absolute GitHub URLs in README resolve (HTTP 200).

## Inspectable Acceptance Criteria

1. **`docs/configuration.md` group-tier section** no longer describes the model assignments as "hardcoded" in a way that implies fixed models. The table heading or surrounding prose clearly states that MED/LOW are **recommendation tiers**: MED agents generally benefit from a medium reasoning model of the user's choice; LOW agents work well with cheaper/lower reasoning models. A note explains that `opencode.jsonc` in the repository is the maintainer's preset example, and users assign their own models via the model-config agent.

2. **`docs/configuration.md` group section** does not describe the config as "contradicting" the docs or frame the bundled preset as a divergence from intent. The preset is presented as a practical ready-to-use starting point.

3. **`docs/agents.md`** includes a cross-link or brief inline definition for "agy" (linking to `docs/configuration.md#agy-integration` or defining it as "Antigravity CLI integration for splitting quota across models"). The term should not appear unexplained in agent descriptions that a reader might encounter independently.

4. **Project Context duplication resolved**: Exactly one of `docs/workflow.md` or `docs/development.md` keeps the full "Project Context" section describing `.ai/context.md`. The other file replaces its duplicate section with a brief sentence and a cross-reference (e.g., "See [Workflow > Project Context](workflow.md#project-context) for details on `.ai/context.md`.").

5. **CI auto-publish shortened**: The `docs/development.md` "CI Auto-Publish" section is reduced to a concise summary (2–4 lines) with a cross-reference to `.github/workflows/publish.yml` as the canonical source. The detailed step-by-step walkthrough (checkout, setup-node, npm ci, npm run check, npm publish) is removed.

6. **`docs/agents.md` agent reference table** remains unchanged in structure and agent descriptions (no rewrites of role summaries). The only addition is the agy cross-link/definition.

7. **README voice and quality preserved**: Edits are additive or surgical. The existing "Why Use It?", "When Not to Use It?", and "Version History" sections are not rewritten.

## Relevant Files

- `package.json` — `"files"` array, `"description"` field, add `"engines"` field
- `README.md` — prerequisites, who-this-is-for, invocation guidance, link conversion, install cross-link, Node.js requirement
- `docs/configuration.md` — group-tier section clarification, preset note
- `docs/agents.md` — agy cross-link/definition
- `docs/development.md` — deduplicate Project Context, shorten CI auto-publish
- `docs/workflow.md` — deduplicate Project Context
- `CHANGELOG.md` — add entry to package `"files"`
- `LICENSE` — add entry to package `"files"`
- `.ai/tasks/012-doc-audit/documentation-report.md` — source of findings (read-only reference)
- `opencode.jsonc` — referenced in configuration docs as the maintainer's preset (not to be changed)
