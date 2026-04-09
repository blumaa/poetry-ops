# Mode: evaluate -- Poem-Journal Fit Evaluation

When the poet provides a poem (title, slug, or local file) and a journal (URL or name), deliver the full evaluation.

## Step 0 -- Gather Inputs

1. **Poem:** Read from website (`https://blumenous-poetry.vercel.app/poem/{slug}`) or local markdown file
2. **Journal:** Use Playwright to scrape submission guidelines from the provided URL
   - Navigate to submission/guidelines page
   - Extract: genres accepted, length limits, reading period, response time, payment, sim-sub policy, reading fee, themes/focus, sample work
   - If Submittable link found, navigate there too for additional details

## Step 1 -- Journal Archetype Detection

Classify the journal using archetypes from `_shared.md`. If hybrid, indicate the 2 closest. This determines:
- Which aspects of the poet's work to highlight
- How to frame the cover letter
- Which poems from the catalog might also be good fits

## Step 2 -- 10-Dimension Scoring

Score each dimension 1-10 per the rubric in `_shared.md`. For each dimension:

| # | Dimension | Score | Evidence |
|---|-----------|-------|----------|
| 1 | Form/Style Match | X/10 | [specific evidence from guidelines + poem] |
| 2 | Thematic Alignment | X/10 | [what the journal publishes vs poem themes] |
| 3 | Length Fit | X/10 | [journal limits vs poem length] |
| 4 | Tone Match | X/10 | [journal aesthetic vs poem tone] |
| 5 | Aesthetic Alignment | X/10 | [based on sample poems if available] |
| 6 | Credits Match | X/10 | [poet's tier vs journal's prestige] |
| 7 | Sim-Sub Policy | X/10 | [journal policy vs poet preference] |
| 8 | Response Time | X/10 | [reported average vs poet's max] |
| 9 | Payment/Prestige | X/10 | [what the journal offers] |
| 10 | Genre/Category Fit | X/10 | [subgenre match] |

**Global Score:** Weighted average per `_shared.md` weights.

## Step 3 -- Fit Analysis

### Strengths
What makes this a good match? Cite specific lines from the poem and specific language from the guidelines.

### Concerns
What doesn't align? For each concern:
1. Is it a hard blocker (e.g., journal only publishes formal verse, poem is free verse)?
2. Is it a soft mismatch (e.g., journal leans political, poem is personal)?
3. Mitigation strategy (e.g., different poem from catalog might fit better)

### Alternative Poems
If the score is below 6.5 for this specific poem, suggest 2-3 poems from the poet's catalog that might score higher for this journal. Reference the pinned poems and series from `_profile.md`.

## Step 4 -- Cover Letter Draft

If score >= 6.5, draft a cover letter:
- Brief bio (from profile.yml)
- Why this poem fits this journal (specific, not generic)
- Relevant credits (if any)
- 150 words max
- No corporate-speak, no gushing flattery
- Honest and specific

## Step 5 -- Submission Logistics

- Reading period: open/closed, deadline if applicable
- Submission method: Submittable, email, postal, other
- Reading fee: amount (if any)
- Simultaneous submission policy
- Response time (reported average)
- Special formatting requirements

---

## Post-evaluation

**ALWAYS** after generating the evaluation:

### 1. Save report

Save to `reports/{###}-{journal-slug}-{YYYY-MM-DD}.md`:

```markdown
# Fit Evaluation: {Poem Title} --> {Journal Name}

**Date:** {YYYY-MM-DD}
**Archetype:** {detected}
**Score:** {X.X/10}
**Poem:** {title} ({source URL or local path})
**Journal:** {name} ({URL})

---

## 10-Dimension Score

(full scoring table)

## Fit Analysis

### Strengths
(content)

### Concerns
(content)

### Alternative Poems
(if applicable)

## Cover Letter Draft
(if score >= 6.5)

## Submission Logistics
(content)
```

### 2. Register in tracker

Add to `data/submissions.md`:
- Next sequential number
- Current date
- Poem title
- Journal name
- Score (X.X/10)
- Status: `Evaluated`
- Manuscript: (pending)
- Report: link to report file
