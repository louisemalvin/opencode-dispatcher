# Agents

This document is the agent reference for OpenCode Dispatcher. It lists every installed agent, describes its role and mode, and explains the permission philosophy that governs how agents interact with your project.

For the end-to-end workflow routing and lifecycle, see [`docs/workflow.md`](workflow.md).

---

## Agent Reference

Dispatcher installs 11 agents. The **orchestrator** is the primary, user-facing coordinator. All other agents are **subagents** — they are invoked by the orchestrator for specific scoped work and are typically hidden from agent selection UIs.

| Agent | Mode | Role Summary |
|---|---|---|
| Orchestrator | primary | User-facing coordinator and state-machine router; clarifies requests, applies docs-first routing to documentation when durable context is needed, owns high-level task decomposition, provides a structured handoff to task-planner, delegates to subagents, and synthesizes results |
| Executor | subagent | Performs exact, mechanical, single-file atomic edits that do not need a task spec, tests, or validation |
| Task Planner | subagent | Creates auditable task specs under `.ai/tasks/` from an orchestrator handoff; owns path allocation, required spec sections, parent/child manifest mechanics, and planning-blocked behavior; formalizes plans without inventing missing strategic decisions; accepts assigned output paths for unit-level planning |
| Implementer | subagent | Edits source code according to an approved task spec and writes an implementation report |
| Validator | subagent | Validates completed work against a task spec and any cited durable source artifacts, runs tests from acceptance criteria, audits test quality, and writes a validation report |
| Test Writer | subagent | Writes tests that encode testable acceptance criteria from an approved task spec; never writes implementation code |
| Documentation | subagent | Creates durable source artifacts (UX briefs, ADRs, domain models, API contracts, etc.) for cross-cutting context; writes documentation, project context updates, decision notes, and task documentation reports; reports when user approval is needed before task-planning |
| Research | subagent | Gathers external facts, official documentation, comparisons, and source-backed evidence before planning decisions |
| Shipper | subagent | Handles git commit and push only when explicitly requested; no edits, deployment, or general development |
| Init | subagent | Bootstraps `.ai/context.md` for new projects by interviewing the user about conventions and test setup |
| Model Config | subagent | Assigns models to agents in the project's `opencode.jsonc` configuration |

For optional agy integration (Antigravity CLI for splitting quota across models), see [Configuration > Agy Integration](configuration.md#agy-integration).

---

## Permission Philosophy

Dispatcher enforces strict boundaries through OpenCode's permission model. Every agent's permissions are declared in its YAML frontmatter (in `workflow/agents/*.md`) and are designed so that no agent can silently cross role boundaries.

### Deny-by-Default

Permissions start locked down. Each agent is granted only the specific capabilities its role requires:

- **Orchestrator**: `edit: deny` — the orchestrator cannot write to any file. Its `bash` permission is a strict whitelist limited to read-only informational commands (`ls`, `pwd`, `which`, `env`, `echo`, `uname`, `file`, `wc`, `git status`, `git diff`, `git log`, `git branch`, `git remote`, `git rev-parse`, `git show`, `git config`, `git stash list`, `git ls-files`). All other shell commands (`*`) are denied. Git write commands (`git commit*`, `git push*`) are explicitly denied.
- **Research**: `edit: deny`, with `webfetch: allow` only. It cannot write files or run arbitrary shell commands.
- **Shipper**: `edit: deny`, `read: allow`, with a strict `bash` whitelist of specific `git` commands (`git status`, `git diff`, `git log`, `git branch`, `git remote`, `git rev-parse`, `git add *`, `git commit *`, `git push*`) and inspection utilities (`find`, `echo`, `sort`, `ls`, `grep`, `head`, `tail`, `cat`, `wc`, `file`, `node -p`). Destructive operations (`git reset*`, `git rebase*`, `git clean*`, `git tag*`, `git commit -a*`, `git commit --amend*`, `gh pr*`, and any deploy commands) are explicitly denied.
- **Task Planner**: `edit` is denied everywhere except `.ai/tasks/**` and `.ai/decisions/**`.
- **Validator**: `edit` is denied everywhere except `.ai/tasks/*/validation-report.md`.
- **Test Writer**: `edit` is denied everywhere except test file patterns (`**/*.test.*`, `**/test_*`, `**/*_test.*`, `**/__tests__/**`, `**/tests/**`, `**/spec/**`). It has no `task` permission.
- **Documentation**: `edit` is denied everywhere except `docs/**`, `README.md`, `README.*`, `CHANGELOG.md`, `.ai/tasks/*/documentation-report.md`, and `.ai/decisions/**`. Configuration files (`.opencode/**`, `opencode.json`, `opencode.jsonc`, `package.json`, `package-lock.json`, lock files) are explicitly denied.
- **Init**: `edit` is denied everywhere except `.ai/context.md`. It has `question: allow` to interview the user.
- **Model Config**: `edit` is denied everywhere except `opencode.jsonc` or `.opencode/opencode.jsonc`. It has no `task` permission.

### Role Boundaries

Each agent owns a specific layer of the workflow. No agent is allowed to cross roles:

- **Orchestrator** coordinates, routes (including docs-first routing), and decomposes but never implements, documents, or validates.
- **Task Planner** plans and decomposes, owns path allocation and planning mechanics, but never edits source code or project docs outside `.ai/`.
- **Implementer** edits source code but cannot write tests (that is the Test Writer's role) or fix validation issues (the Validator reports them; only a new task can fix them).
- **Validator** reads and reports (against task spec AND cited source artifacts) but never fixes issues or edits code.
- **Test Writer** writes tests but never writes implementation code.
- **Documentation** creates durable source artifacts where needed, writes docs and context, but never edits source code or configuration.
- **Research** gathers evidence but never implements or edits.
- **Shipper** commits and pushes but never edits files, runs tests, or deploys.
- **Init** bootstraps context but never edits source code or task artifacts.
- **Model Config** configures model assignments but never edits code, docs, or `.ai/` artifacts.

### Escape Hatch Sealing

A secure permission model must ensure that restricted capabilities cannot be bypassed through allowed tools. Dispatcher seals the two common escape hatches:

1. **`edit: deny` must not be subverted through shell commands.** The orchestrator has `edit: deny` and a read-only `bash` whitelist. Commands that could write files (e.g., `echo > file`, `cat > file`, `tee`, `redirects` in shell) are not in the whitelist; the `*: deny` fallback catches everything else. No shell-based file write is possible.

2. **`bash` whitelists must not contain write-capable commands.** The orchestrator's whitelist is limited to read-only queries. The shipper's whitelist allows specific `git` operations but denies `git reset`, `git rebase`, `git clean`, `git tag`, `git commit -a`, `git commit --amend`, and force-push variants. The validator has broad `bash: allow` but `edit: deny` (except its own report), so destructive shell commands are blocked by the edit layer.

### Practical Allowances

Some agents have intentionally broad permissions to avoid excessive prompting during normal development cycles:

- **Implementer**: `bash: * allow` so it can seamlessly run test, build, and dev commands without permission prompts. Its `edit` scope prevents it from touching `.ai/tasks/**` (except its own `implementation-report.md`), `.ai/context.md`, and `.ai/decisions/**` — it can edit source code freely but cannot alter task artifacts.
- **Validator**: `bash: * allow` for the same reason — running test suites and build commands should not require repeated approval. Its `edit` scope is tightly restricted (only `validation-report.md`).
- **Executor**: Both `bash: * allow` and `edit: * allow` because it handles exact, mechanical, low-risk edits where the overhead of restricted permissions would add friction without safety benefit. If an edit exceeds this scope, the executor escalates back to the orchestrator.

### Task Gating

The orchestrator's `task` permission is explicitly scoped to named agents — no wildcard task permission exists:

```yaml
task:
  "*": deny
  task-planner: allow
  implementer: allow
  documentation: allow
  validator: allow
  research: allow
  shipper: allow
  test-writer: allow
  init: allow
  model-config: allow
  executor: allow
```

This means the orchestrator can only delegate to the 10 explicitly listed subagents. It cannot delegate to an arbitrary or unknown agent, which prevents privilege escalation through delegation.

---

## Summary

Dispatcher's permission model follows a simple principle: **an agent can do everything its role requires and nothing its role does not**. Permissions are layered — `edit`, `bash`, and `task` are each scoped independently — and the deny-by-default baseline ensures that every allowance is intentional and auditable through the agent's YAML frontmatter.

For workflow-level routing and the execution lifecycle, see [`docs/workflow.md`](workflow.md).
