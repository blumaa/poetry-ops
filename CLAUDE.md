# Poetry-Ops -- AI Poetry Submission Pipeline

## Origin

Inspired by [santifer/career-ops](https://github.com/santifer/career-ops). That system evaluates job offers and generates tailored CVs. This one evaluates literary journals and generates Shunn-formatted manuscripts for poetry submissions.

**It will work out of the box, but it's designed to be made yours.** If the scoring dimensions don't match your priorities, the journal archetypes don't cover your market, or the manuscript format needs tweaking -- just ask. You (AI Agent) can edit the user's files. The user says "weight thematic alignment higher" and you do it.

## Data Contract (CRITICAL)

There are two layers. Read `DATA_CONTRACT.md` for the full list.

**User Layer (NEVER auto-updated, personalization goes HERE):**
- `config/profile.yml`, `modes/_profile.md`
- `data/*`, `reports/*`, `output/*`

**System Layer (auto-updatable, DON'T put user data here):**
- `modes/_shared.md`, `modes/evaluate.md`, all other modes
- `CLAUDE.md`, `*.mjs` scripts, `templates/*`

**THE RULE: When the user asks to customize anything (style identity, themes, credits, scoring weights), ALWAYS write to `modes/_profile.md` or `config/profile.yml`. NEVER edit `modes/_shared.md` for user-specific content.** This ensures system updates don't overwrite their customizations.

## What is poetry-ops

AI-powered poetry submission automation built on Claude Code: journal evaluation, manuscript generation, submission tracking, fit scoring.

### Main Files

| File | Function |
|------|----------|
| `data/submissions.md` | Submission tracker |
| `data/pipeline.md` | Inbox of pending journal URLs |
| `data/poems.json` | Full text of all 170 poems (from Supabase) |
| `data/poem-catalog.csv` | Poem index: title, slug, form, themes, series, word count |
| `data/top-1000-lit-mags-2025.csv` | Reference DB: 1,126 ranked lit mags with prestige scores, costs, reading periods |
| `templates/manuscript.html` | Shunn-format HTML template |
| `generate-manuscript.mjs` | Playwright: HTML to PDF |
| `reports/` | Fit evaluation reports (format: `{###}-{journal-slug}-{YYYY-MM-DD}.md`) |

### Poem Source of Truth

Poems are sourced from the poet's Supabase database (same data as website):

- **Primary:** `data/poems.json` — full text of all 170 poems, pulled from Supabase
- **Index:** `data/poem-catalog.csv` — searchable catalog with form, themes, series, word count
- **Website:** per `config/profile.yml` `poet.poem_source_url` + `poet.poem_url_pattern`
- **Supabase:** Project `bjtaspwqhorddkjfzgfn` — credentials in blume-poetry `.env.local`. Use to refresh `poems.json` if poems are added/updated.
- The CLI can also read local markdown files from the working directory
- **NEVER modify the poet's database or website content**
- **NEVER fabricate poem content** -- always read from source

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes journal URL or name | auto-pipeline (evaluate + report + tracker) |
| Asks to evaluate fit | `evaluate` |
| Wants to generate manuscript | `manuscript` |
| Asks about submission status | `tracker` |
| Searches for journals | `scan` |
| Processes pending URLs | `pipeline` |

### First Run -- Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** Run these checks silently every session:

1. Does `config/profile.yml` exist (not just profile.example.yml)?
2. Does `modes/_profile.md` exist?

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations until the basics are in place. Guide the user step by step:

#### Step 1: Profile (required)
If `config/profile.yml` is missing, copy from `config/profile.example.yml` and ask:
> "I need a few details to set up:
> - Your full name (as it appears on manuscripts)
> - Your email and mailing address (for submissions)
> - Your publication credits (if any)
> - What kind of journals are you targeting? (literary magazines, chapbook presses, online journals)
>
> I'll set everything up."

Fill in `config/profile.yml` with their answers.

#### Step 2: Style Identity (recommended)
> "The system works better when it knows your poetic style. Tell me about:
> - Your primary forms (free verse, formal, prose poetry, experimental)
> - Your recurring themes
> - Poets you consider influences
> - Any deal-breakers? (e.g., no journals that charge reading fees, no simultaneous submission restrictions)
>
> The more I know, the better I match you to journals."

Store insights in `modes/_profile.md`.

#### Step 3: Tracker
If `data/submissions.md` doesn't exist, create it:
```markdown
# Submissions Tracker

| # | Date | Poem | Journal | Score | Status | Manuscript | Report | Notes |
|---|------|------|---------|-------|--------|------------|--------|-------|
```

#### Step 4: Ready
> "You're all set! You can now:
> - Paste a journal submission URL to evaluate fit
> - Run `/poetry-ops manuscript` to generate a Shunn-formatted PDF
> - Run `/poetry-ops` to see all commands"

### Personalization

This system is designed to be customized by YOU (AI Agent). When the user asks you to change scoring weights, add journal types, adjust manuscript formatting -- do it directly.

**Common customization requests:**
- "Weight thematic alignment higher" -> edit `modes/_shared.md`
- "Add my new publication credit" -> edit `config/profile.yml`
- "Update my style identity" -> edit `modes/_profile.md`
- "Change the manuscript template" -> edit `templates/manuscript.html`

---

## Ethical Use -- CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the poet find and submit to journals where there is a genuine fit -- not to spam journals with mass submissions.

- **NEVER submit poems without the poet reviewing the submission first.** Generate manuscripts, draft cover letters -- but always STOP before submitting. The poet makes the final call.
- **Strongly discourage low-fit submissions.** If a score is below 6/10, explicitly recommend against submitting. The poet's time and the editor's time are both valuable.
- **Quality over speed.** A well-targeted submission to 5 journals beats a scattershot to 50.
- **Respect editors' time.** Every submission a reader evaluates costs someone's attention. Only send what's worth reading.
- **Respect simultaneous submission policies.** Track which poems are out where. Never recommend submitting a poem that's already under exclusive review.

---

## Journal Verification -- MANDATORY

**NEVER trust WebSearch/WebFetch to verify if a journal is currently accepting submissions.** ALWAYS use Playwright:
1. `browser_navigate` to the submission URL
2. `browser_snapshot` to read submission guidelines and status
3. Check for: open/closed reading periods, Submittable/Duotrope links, specific deadlines

---

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data)
- Scripts in `.mjs`, configuration in YAML
- Submission documents: always `.docx` by default (via pandoc), `.pdf` only when journal specifically requires it
- Formatting: ALWAYS preserve original line breaks, stanza spacing, enjambment from poems.json — never reflow
- Bio/credits: always read from `config/profile.yml` `credits.bio` field — never fabricate
- Output in `output/` (gitignored), Reports in `reports/`
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: NEVER create duplicate entries in submissions.md for same poem+journal pair.** Update the existing entry.
