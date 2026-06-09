#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const workflowDir = path.join(root, "workflow")
const targetDir = path.join(process.env.HOME || "", ".config", "opencode")
const command = process.argv[2] || "install"
const installPayloads = ["agents"]

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

function markdownFiles(dir) {
  if (!exists(dir)) return []
  return fs.readdirSync(dir).filter((entry) => entry.endsWith(".md")).sort()
}

function containsFiles(dir) {
  if (!exists(dir)) return false

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile()) return true
    if (entry.isDirectory() && containsFiles(path.join(dir, entry.name))) return true
  }

  return false
}

function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  if (!content.startsWith("---\n")) return null

  const end = content.indexOf("\n---", 4)
  if (end === -1) return null

  return content.slice(4, end).trimEnd()
}

function orchestratorTaskPermissions(frontmatter) {
  const names = []
  const lines = frontmatter.split("\n")
  const taskIndex = lines.findIndex((line) => /^  task:\s*$/.test(line))

  if (taskIndex === -1) return names

  for (const line of lines.slice(taskIndex + 1)) {
    if (/^  \S/.test(line)) break

    const match = line.match(/^    ([A-Za-z0-9_-]+):\s*allow\s*$/)
    if (match) names.push(match[1])
  }

  return names.sort()
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

  console.log(`Installed OpenCode Dispatcher agents to ${targetDir}`)
  if (backups.length > 0) {
    console.log("Backups created:")
    for (const [target, backup] of backups) {
      console.log(`- ${target} -> ${backup}`)
    }
    console.log("To restore a backup, remove or rename the installed path and move the matching .bak-* path back into place.")
  }
  console.log("Next steps:")
  console.log("1. Restart OpenCode so it reloads ~/.config/opencode.")
  console.log("2. Open a project; the orchestrator initializes .ai/ automatically when needed.")
  console.log("3. For substantial work, ask OpenCode Dispatcher to create a task spec, implement it, and validate it.")
}

function check() {
  const agentsDir = path.join(workflowDir, "agents")
  const skillsDir = path.join(workflowDir, "skills")
  const templatesDir = path.join(workflowDir, "templates")
  const agentFiles = markdownFiles(agentsDir)
  const errors = []

  if (agentFiles.length === 0) {
    errors.push("No agent files found in workflow/agents")
  }

  if (containsFiles(skillsDir)) {
    errors.push("workflow/skills must be empty or absent; workflow behavior now lives in agents")
  }

  if (containsFiles(templatesDir)) {
    errors.push("workflow/templates must be empty or absent; report structures now live in agent prompts")
  }

  for (const file of agentFiles) {
    const agentPath = path.join(agentsDir, file)
    const frontmatter = extractFrontmatter(agentPath)
    if (!frontmatter) {
      errors.push(`workflow/agents/${file} is missing YAML frontmatter`)
      continue
    }

    if (!/^description:\s+.+$/m.test(frontmatter)) errors.push(`workflow/agents/${file} is missing frontmatter description`)
    if (!/^mode:\s+(primary|subagent|all)\s*$/m.test(frontmatter)) errors.push(`workflow/agents/${file} is missing valid frontmatter mode`)
  }

  const orchestratorPath = path.join(agentsDir, "orchestrator.md")
  const orchestratorFrontmatter = exists(orchestratorPath) ? extractFrontmatter(orchestratorPath) : null

  if (!orchestratorFrontmatter) {
    errors.push("workflow/agents/orchestrator.md is missing YAML frontmatter")
  } else {
    const permittedAgents = orchestratorTaskPermissions(orchestratorFrontmatter)
    const fileAgents = agentFiles.map((file) => file.replace(/\.md$/, "")).filter((name) => name !== "orchestrator").sort()

    for (const name of permittedAgents) {
      if (!fileAgents.includes(name)) errors.push(`orchestrator permits missing agent: workflow/agents/${name}.md`)
    }

    for (const name of fileAgents) {
      if (!permittedAgents.includes(name)) errors.push(`agent file is not permitted by orchestrator: workflow/agents/${name}.md`)
    }
  }

  if (errors.length > 0) {
    console.error("Workflow package check failed:")
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log(`Workflow package check passed. Agents: ${agentFiles.map((file) => file.replace(/\.md$/, "")).join(", ")}.`)
}

if (command === "install") {
  install()
} else if (command === "check") {
  check()
} else {
  console.error("Usage: opencode-dispatcher [install|check]")
  console.error("  install  Copy agents into ~/.config/opencode")
  console.error("  check    Verify workflow agent files and orchestrator references")
  process.exitCode = 1
}
