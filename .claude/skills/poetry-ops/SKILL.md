---
name: poetry-ops
description: AI poetry submission pipeline -- evaluate journal fit, generate manuscripts, track submissions
user_invocable: true
args: mode
---

# poetry-ops -- Router

## Mode Routing

Determine the mode from `{{mode}}`:

| Input | Mode |
|-------|------|
| (empty / no args) | `discovery` -- Show command menu |
| Journal URL or name (no sub-command) | **`auto-pipeline`** |
| `evaluate` | `evaluate` |
| `manuscript` | `manuscript` |
| `tracker` | `tracker` |
| `scan` | `scan` |
| `pipeline` | `pipeline` |

**Auto-pipeline detection:** If `{{mode}}` is not a known sub-command AND contains a URL to a journal submission page or journal name + poem reference, execute `auto-pipeline` (evaluate + report + tracker).

If `{{mode}}` is not a sub-command AND doesn't look like a journal reference, show discovery.

---

## Discovery Mode (no arguments)

Show this menu:

```
poetry-ops -- Submission Command Center

Available commands:
  /poetry-ops {journal URL}  --> AUTO-PIPELINE: evaluate fit + report + tracker
  /poetry-ops evaluate       --> Evaluate poem-journal fit (10-dimension score)
  /poetry-ops manuscript     --> Generate Shunn-formatted PDF manuscript
  /poetry-ops tracker        --> Submission status overview
  /poetry-ops scan           --> Search for journals accepting submissions
  /poetry-ops pipeline       --> Process pending journal URLs (data/pipeline.md)

Inbox: add journal URLs to data/pipeline.md --> /poetry-ops pipeline
Or paste a journal submission URL to run evaluation.
```

---

## Context Loading by Mode

After determining the mode, load the necessary files before executing:

### Modes that require `_shared.md` + their mode file:
Read `modes/_shared.md` + `modes/{mode}.md`

Applies to: `auto-pipeline`, `evaluate`, `manuscript`, `scan`, `pipeline`

### Standalone modes (only their mode file):
Read `modes/{mode}.md`

Applies to: `tracker`

### Modes delegated to subagent:
For `scan` and `pipeline` (3+ URLs): launch as Agent with the content of `_shared.md` + `modes/{mode}.md` injected into the subagent prompt.

Execute the instructions from the loaded mode file.
