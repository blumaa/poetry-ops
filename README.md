# Poetry-Ops

AI-powered poetry submission pipeline built on [Claude Code](https://claude.ai/code). Evaluate journal fit, generate Shunn-formatted manuscripts, and track submissions -- all from your terminal.

Inspired by [santifer/career-ops](https://github.com/santifer/career-ops), which automates job search pipelines. Poetry-ops applies the same agentic architecture to the poetry submission process.

## How It Works

```
                    ┌─────────────────────────────────┐
                    │         Claude Code Agent        │
                    │   (reads CLAUDE.md + modes/*.md) │
                    └──────────┬──────────────────────┘
                               │
                 ┌─────────────┼─────────────────┐
                 │             │                  │
          ┌──────▼──────┐ ┌───▼────────┐  ┌──────▼──────┐
          │  Evaluate   │ │  Manuscript │  │    Scan     │
          │ (fit score) │ │ (Shunn PDF)│  │  (journals) │
          └──────┬──────┘ └───┬────────┘  └──────┬──────┘
                 │            │                   │
          ┌──────▼────────────▼───────────────────▼──────┐
          │                Output Pipeline                │
          │  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
          │  │Report .md│  │ PDF (Shunn │  │ Tracker  │  │
          │  │(10-dim)  │  │ via Playw.)│  │ (md tbl) │  │
          │  └──────────┘  └────────────┘  └──────────┘  │
          └───────────────────┬───────────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ data/submissions.md  │
                   │  (canonical tracker) │
                   └─────────────────────┘
```

You paste a journal's submission URL. The agent scrapes the guidelines with Playwright, reads your poem, scores the fit across 10 dimensions, drafts a cover letter, generates a submission-ready `.docx`, and can submit directly to Submittable on your behalf. Everything gets tracked in a markdown table.

## What It Can Do

- **Evaluate** journal fit with 10-dimension scoring
- **Generate** properly formatted manuscripts (`.docx`)
- **Find** open, free journals that match your style
- **Submit** directly to Submittable (automated browser submission)
- **Track** all submissions, responses, and rejections

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and configured
- Node.js 18+
- [Pandoc](https://pandoc.org/installing.html) (for `.docx` generation)
- Playwright MCP (for journal verification and automated Submittable submissions)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/blumaa/poetry-ops.git
cd poetry-ops
npm install
npx playwright install chromium
```

### 2. Verify setup

```bash
npm run doctor
```

### 3. Configure your profile

```bash
cp config/profile.example.yml config/profile.yml
```

Edit `config/profile.yml` with your details:

```yaml
poet:
  full_name: "Your Name"
  email: "you@example.com"
  website: "https://your-poetry-site.com"
```

### 4. Add your poems

Create `data/poems.json` with your poems:

```json
[
  {
    "title": "My Poem Title",
    "slug": "my-poem-title",
    "text": "first line of the poem\nsecond line\n\nstanza break\nmore lines"
  }
]
```

Or just tell Claude: *"Here are my poems"* and paste them. It will create the file for you.

### 5. Define your style identity

Edit `modes/_profile.md` with your poetic style, themes, influences, and journal preferences. The more detail here, the better the fit scoring works. Or just tell Claude about yourself and it will set this up.

### 6. Start using

```bash
claude
```

Then run any command:

```
/poetry-ops                              # Show all commands
/poetry-ops https://journal.com/submit   # Evaluate fit (auto-pipeline)
/poetry-ops evaluate                     # Evaluate a poem-journal pair
/poetry-ops manuscript                   # Generate Shunn PDF
/poetry-ops tracker                      # View submission status
```

## Commands

| Command | What it does |
|---------|-------------|
| `/poetry-ops {URL}` | Auto-pipeline: evaluate fit + report + tracker |
| `/poetry-ops evaluate` | 10-dimension fit evaluation for a poem-journal pair |
| `/poetry-ops manuscript` | Generate a Shunn-formatted PDF manuscript |
| `/poetry-ops tracker` | View submission status overview |
| `/poetry-ops scan` | Search for journals accepting submissions |
| `/poetry-ops pipeline` | Process pending journal URLs from inbox |

## 10-Dimension Fit Score

Every poem-journal pair is scored 1-10 across these dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Form/Style Match | 15% | Does the journal publish this form? |
| Thematic Alignment | 15% | Do themes match the journal's editorial focus? |
| Length Fit | 5% | Within the journal's limits? |
| Tone Match | 10% | Register alignment (literary, accessible, experimental) |
| Aesthetic Alignment | 15% | Sensibility match based on recent issues |
| Credits Match | 10% | Poet's tier vs. journal's prestige |
| Sim-Sub Policy | 5% | Simultaneous submission allowed? |
| Response Time | 5% | Average days to response |
| Payment/Prestige | 10% | Compensation and reputation value |
| Genre/Category Fit | 10% | Subgenre match (lyric, narrative, prose poem, etc.) |

**Score interpretation:**
- **8.0+** -- Submit with confidence
- **6.5-7.9** -- Worth submitting
- **5.0-6.4** -- Only if you have a specific reason
- **Below 5.0** -- Recommend against

## Project Structure

```
poetry-ops/
├── .claude/skills/poetry-ops/
│   └── SKILL.md              # Skill router (the "CLI")
├── modes/                    # System layer (evaluation logic)
│   ├── _shared.md            # Scoring system, rules, archetypes
│   ├── _profile.md           # YOUR style identity (never auto-updated)
│   ├── evaluate.md           # Fit evaluation mode
│   └── manuscript.md         # Shunn PDF generation mode
├── config/
│   ├── profile.yml           # Your poet identity and preferences
│   └── profile.example.yml   # Template for new users
├── data/                     # User layer (your submissions)
│   ├── submissions.md        # Canonical submission tracker
│   └── pipeline.md           # Journal URL inbox
├── templates/
│   ├── manuscript.html       # Shunn HTML template
│   └── states.yml            # Canonical submission statuses
├── reports/                  # Fit evaluation reports
├── output/                   # Generated manuscript PDFs
├── generate-manuscript.mjs   # Playwright HTML-to-PDF
├── CLAUDE.md                 # Agent instructions
├── DATA_CONTRACT.md          # System vs. user layer rules
└── package.json
```

### Two-Layer Architecture

Borrowed from career-ops, the codebase has a strict separation:

- **System layer** (`modes/_shared.md`, `modes/evaluate.md`, templates, scripts) -- contains evaluation logic and can be safely updated without losing your data.
- **User layer** (`modes/_profile.md`, `config/profile.yml`, `data/*`, `reports/*`, `output/*`) -- contains your personal style, submissions, and work product. Never touched by updates.

The boundary is enforced by `DATA_CONTRACT.md`.

## Submission Tracking

Submissions are tracked in `data/submissions.md` as a markdown table:

```markdown
| # | Date | Poem | Journal | Score | Status | Manuscript | Report | Notes |
|---|------|------|---------|-------|--------|------------|--------|-------|
| 1 | 2026-04-09 | Strawberry Moon | Rattle | 8.2/10 | Submitted | output/... | [001](...) | Sim-sub OK |
```

### Status Lifecycle

`Evaluated` --> `Drafting` --> `Submitted` --> `Under Review` --> `Accepted` / `Rejected` / `Withdrawn` --> `Published`

All canonical statuses are defined in `templates/states.yml`.

## Shunn Manuscript Format

The manuscript generator follows [William Shunn's standard format](https://www.shunn.net/format/poem/):

- 12pt Courier New, 1-inch margins
- Contact info top-left, line count top-right
- Title centered halfway down the first page
- Running header on subsequent pages: `Last Name / TITLE / page`
- End marker: `#`

## Customization

Everything is designed to be customized by the agent. Common requests:

- *"Weight thematic alignment higher"* -- edit `modes/_shared.md`
- *"Add my new publication credit"* -- edit `config/profile.yml`
- *"I write mostly prose poetry"* -- edit `modes/_profile.md`
- *"Change the manuscript font"* -- edit `templates/manuscript.html`

## Automated Submittable Submissions

With Playwright MCP configured, the agent can submit directly to journals that use Submittable:

1. It navigates to the journal's Submittable page
2. Logs in via your Google account (you authenticate once)
3. Fills the cover letter, uploads the `.docx`, checks required boxes
4. Unchecks paid add-ons (subscriptions, tips)
5. Clicks Submit

Just say: *"Find journals and submit for me"* and it handles everything.

## Ethical Use

This system prioritizes quality over quantity. It will:
- **Never submit without your approval** -- it drafts, you decide
- **Discourage low-fit submissions** -- scores below 6/10 get a warning
- **Track simultaneous submissions** -- prevents conflicts with exclusive review journals
- **Respect reading periods** -- closed means closed

## License

MIT
