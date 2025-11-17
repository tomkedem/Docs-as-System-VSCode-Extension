# 🧰 git — Safe and Controlled Git Scripts for Docs-as-System

This folder contains the official Git script set for Docs-as-System.  
The scripts are designed to operate safely, consistently, and transparently inside a modern development environment where  
human developers and AI agents work together in the same codebase.

All scripts in this folder do not rely solely on external environment variables.  
Instead, they rely on a single central configuration file:

`AGENT_CONFIG.yaml`

This file defines all Git-related policies for the project, allowing changes to be made in one place  
without modifying the scripts themselves.

---

## 🎯 What Problems Do These Scripts Solve?

When working with AI agents inside an IDE, two needs arise:

1. **Protecting the codebase**  
   The agent must operate within strict boundaries so it cannot overwrite branches, perform unwanted pushes,  
   or create pull requests in an invalid state.

2. **Full consistency across different projects**  
   Git behavior must be identical in every project built under Docs-as-System:  
   same rules, same allowed paths, same CycleId structure, same PR workflow.

As a result, a unified set of scripts was created to handle all Git operations:  
from creating a new branch to merging an approved pull request.

---

## 📁 Files in This Folder

| File | Purpose |
|------|---------|
| **`CREATE_BRANCH.sh`** | Creates a new working branch from the default branch, enforcing allowed branch patterns and protecting restricted branches. Includes checks for clean working tree, valid naming, and non-protected targets. |
| **`STAGE_AND_COMMIT.sh`** | Stages only allowed paths (`docs/**`, `src/**`) and creates a tagged commit with CycleId and trailers based on the YAML commit policy. |
| **`PUSH_BRANCH.sh`** | Pushes the branch to `origin` only when `allowAgentPush=true`. Prevents pushing protected branches. |
| **`OPEN_PULL_REQUEST.sh`** | Opens a draft Pull Request using `gh`. Performs checks ensuring no existing PR, branch validity, upstream availability, and policy compliance. |
| **`MERGE_AFTER_APPROVAL.sh`** | Performs merge operations only by a human, never by the agent. Validates PR status, branch protection, and test success. |

All scripts are small, precise, and perform one safe operation only.

---

## 🧩 Unified Policy Loading for All Scripts

Every Git script uses the following shared loading block:

```bash
CONFIG_FILE="docs/agent/AGENT_CONFIG.yaml"

command -v yq >/dev/null 2>&1 || fail "yq is required"

DEFAULT_BRANCH="$(yq '.git.defaultBranch' "$CONFIG_FILE")"
ALLOW_AGENT_PUSH="$(yq '.git.allowAgentPush' "$CONFIG_FILE")"
ALLOW_AGENT_COMMIT="$(yq '.git.allowAgentCommit' "$CONFIG_FILE")"

mapfile -t PROTECTED_BRANCHES < <(yq '.git.protectedBranches[]' "$CONFIG_FILE")
mapfile -t ALLOWED_PATHS_ARRAY < <(yq '.git.allowedPaths[]' "$CONFIG_FILE")

This ensures predictable behavior:  
all operations follow a single unified policy with no duplicated logic or hidden assumptions.

---

## 🔑 The Only External Variable: `CYCLE_ID`

Every commit must be linked to a specific work cycle, for example:

2025_11_13_001


The scripts do **not** generate this value.  
It comes directly from the task context — provided by a human or by the system operating the agent (IDE/Agent).

### Example Usage

```bash
CYCLE_ID=2025_11_14_002 ./STAGE_AND_COMMIT.sh
```
This guarantees full traceability across:

- written code  
- log files  
- cycle summaries  
- validation results  
- pull requests  
- all Docs-as-System project documentation  

---

## 📋 Requirements

For proper execution, the following must be installed and configured:

- Git  
- `yq` for YAML parsing  
- GitHub CLI (`gh`)  
- Authentication via `gh auth login`  
- Permissions aligned with:  
  - `AGENT_OPERATIONAL_POLICY.md`  
  - `HUMAN_OPERATIONAL_POLICY.md`  

---

## 🛡️ Mandatory Safety Principles

The scripts include multiple safety layers to protect both the repository and the workflow.

### Repository Protections

- No creation of protected branch names  
- No pushes unless `allowAgentPush=true`  
- No commits unless `allowAgentCommit=true`  
- No changes outside `allowedPaths`  
- No history rewrites  
- No agent-based force-push  

### Workflow Protections

- Every PR is opened as a draft  
- Merges are performed by humans only  
- All tests must pass before merging  
- Every commit must include a `CYCLE_ID`  
- Every action is logged in `IMPLEMENTATION_LOG`  

### Agent Responsibility

The agent performs only controlled, policy-guided operations.  
The human retains full authority over sensitive steps such as push, merge, and approval.

---

© 2025 Tomer Kedem  
Part of the official Docs-as-System template suite.
