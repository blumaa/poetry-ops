# Data Contract

This document defines which files belong to the **system** (auto-updatable) and which belong to the **user** (never touched by updates).

## User Layer (NEVER auto-updated)

These files contain your personal data, customizations, and work product. Updates will NEVER modify them.

| File | Purpose |
|------|---------|
| `config/profile.yml` | Your identity, credits, submission preferences |
| `modes/_profile.md` | Your style identity, themes, aesthetic, influences |
| `data/submissions.md` | Your submission tracker |
| `data/pipeline.md` | Your journal URL inbox |
| `reports/*` | Your fit evaluation reports |
| `output/*` | Your generated manuscripts |

## System Layer (safe to auto-update)

These files contain system logic, scripts, templates, and instructions that improve with each release.

| File | Purpose |
|------|---------|
| `modes/_shared.md` | Scoring system, global rules, journal archetypes |
| `modes/evaluate.md` | Evaluation mode instructions |
| `modes/manuscript.md` | Manuscript generation instructions |
| `modes/auto-pipeline.md` | Auto-pipeline instructions |
| `modes/tracker.md` | Tracker instructions |
| `modes/scan.md` | Journal scanner instructions |
| `modes/pipeline.md` | Pipeline processing instructions |
| `CLAUDE.md` | Agent instructions |
| `*.mjs` | Utility scripts |
| `templates/*` | Base templates |
| `.claude/skills/*` | Skill definitions |
| `DATA_CONTRACT.md` | This file |

## The Rule

**If a file is in the User Layer, no update process may read, modify, or delete it.**

**If a file is in the System Layer, it can be safely replaced with the latest version from the upstream repo.**
