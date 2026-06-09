#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const workflowDir = path.join(root, "workflow")
const targetDir = path.join(process.env.HOME || "", ".config", "opencode")
const projectTemplatesDir = path.join(process.cwd(), ".ai", "templates")
const command = process.argv[2] || "install"
const installPayloads = ["agents", "skills"]
const templatePayloads = [
  "task-spec.md",
  "implementation-report.md",
  "documentation-report.md",
  "validation-report.md"
]

function exists(filePath) {
  return fs.existsSync(filePath)
}

function copyRecursive(source, target) {
  const stat = fs.statSync(source)

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true })
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry))
    }
    return
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
}

function backupPath(filePath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  return `${filePath}.bak-${stamp}`
}

function backupIfExists(filePath) {
  if (!exists(filePath)) return null

  const target = backupPath(filePath)
  fs.cpSync(filePath, target, { recursive: true })
  return target
}

function install() {
  if (!process.env.HOME) {
    throw new Error("HOME is not set; cannot locate ~/.config/opencode")
  }

  if (!exists(workflowDir)) {
    throw new Error(`Missing workflow directory: ${workflowDir}`)
  }

  fs.mkdirSync(targetDir, { recursive: true })

  const backups = []

  for (const item of installPayloads) {
    const source = path.join(workflowDir, item)
    const target = path.join(targetDir, item)

    if (!exists(source)) continue

    const backup = backupIfExists(target)
    if (backup) backups.push([target, backup])
    copyRecursive(source, target)
  }

  for (const item of templatePayloads) {
    const source = path.join(workflowDir, "templates", item)
    const target = path.join(projectTemplatesDir, item)

    if (!exists(source)) continue

    const backup = backupIfExists(target)
    if (backup) backups.push([target, backup])
    copyRecursive(source, target)
  }

  console.log(`Installed OpenCode Dispatcher agents and skills to ${targetDir}`)
  console.log(`Installed project templates to ${projectTemplatesDir}`)
  if (backups.length > 0) {
    console.log("Backups created:")
    for (const [target, backup] of backups) {
      console.log(`- ${target} -> ${backup}`)
    }
    console.log("To restore a backup, remove or rename the installed path and move the matching .bak-* path back into place.")
  }
  console.log("Next steps:")
  console.log("1. Restart OpenCode so it reloads ~/.config/opencode.")
  console.log("2. Open this project so agents can read .ai/templates without global-template permission prompts.")
  console.log("3. Ask the orchestrator to run /ai-init if the project has no .ai/context.md yet.")
  console.log("4. For substantial work, ask OpenCode Dispatcher to create a task spec, implement it, and validate it.")
}

function check() {
  const requiredInstallPayloads = [
    "workflow/agents/orchestrator.md",
    "workflow/agents/task-planner.md",
    "workflow/agents/implementer.md",
    "workflow/agents/documentation.md",
    "workflow/agents/research.md",
    "workflow/agents/shipper.md",
    "workflow/agents/test-writer.md",
    "workflow/agents/validator.md",
    "workflow/skills/task-artifact-workflow/SKILL.md",
    "workflow/templates/task-spec.md",
    "workflow/templates/implementation-report.md",
    "workflow/templates/documentation-report.md",
    "workflow/templates/validation-report.md"
  ]
  const required = requiredInstallPayloads

  const missing = required.filter((item) => !exists(path.join(root, item)))
  if (missing.length > 0) {
    console.error("Missing required files:")
    for (const item of missing) console.error(`- ${item}`)
    process.exitCode = 1
    return
  }

  console.log("Workflow package check passed. Required files: agents, skills, templates.")
}

if (command === "install") {
  install()
} else if (command === "check") {
  check()
} else {
  console.error("Usage: opencode-dispatcher [install|check]")
  console.error("  install  Copy agents and skills into ~/.config/opencode, and templates into .ai/templates")
  console.error("  check    Verify required workflow files are present in this package")
  process.exitCode = 1
}
