# System Context -- poetry-ops

<!-- ============================================================
     THIS FILE IS AUTO-UPDATABLE. Don't put personal data here.

     Your customizations go in modes/_profile.md (never auto-updated).
     This file contains system rules, scoring logic, and tool config
     that improve with each poetry-ops release.
     ============================================================ -->

## Sources of Truth

| File | Path | When |
|------|------|------|
| profile.yml | `config/profile.yml` | ALWAYS (poet identity and preferences) |
| _profile.md | `modes/_profile.md` | ALWAYS (style identity, themes, aesthetic) |
| poems.json | `data/poems.json` | During evaluation (full poem text lookup by slug) |
| poem-catalog.csv | `data/poem-catalog.csv` | During evaluation (search/filter poems by theme, form, series, length) |
| lit-mags-db | `data/top-1000-lit-mags-2025.csv` | During evaluation (cross-reference prestige, cost, restrictions) |

**RULE: NEVER fabricate poem content or publication credits.** Read poems from the poet's website or local files.
**RULE: Read _profile.md AFTER this file. User customizations in _profile.md override defaults here.**

---

## Scoring System -- 10-Dimension Fit Score

Each poem-journal pair is scored across 10 dimensions on a 1-10 scale. The global score is a weighted average.

| # | Dimension | Weight | What it measures |
|---|-----------|--------|-----------------|
| 1 | **Form/Style Match** | 15% | Does the journal publish this form? (free verse, formal, prose poetry, experimental, hybrid) |
| 2 | **Thematic Alignment** | 15% | Do the poem's themes match the journal's editorial focus and recent issues? |
| 3 | **Length Fit** | 5% | Is the poem within the journal's word/line/page count limits? |
| 4 | **Tone Match** | 10% | Does the poem's register (literary, accessible, avant-garde, confessional, political) match? |
| 5 | **Aesthetic Alignment** | 15% | Based on sample poems in recent issues -- does the poem's sensibility fit? |
| 6 | **Credits Match** | 10% | Does the poet's publication history match the journal's prestige tier? |
| 7 | **Sim-Sub Policy** | 5% | Does the journal allow simultaneous submissions? (respects poet's preferences) |
| 8 | **Response Time** | 5% | Average days to response vs poet's max_response_days |
| 9 | **Payment/Prestige** | 10% | Contributor copies, payment, exposure, reputation value |
| 10 | **Genre/Category Fit** | 10% | Poetry subgenre match -- lyric, narrative, prose poem, ekphrastic, documentary, etc. |

**Score interpretation:**
- 8.0+ --> Strong match, submit with confidence
- 6.5-7.9 --> Good match, worth submitting
- 5.0-6.4 --> Decent but not ideal, submit only if specific reason
- Below 5.0 --> Recommend against submitting (see Ethical Use in CLAUDE.md)

**Per-dimension scoring:**
- 9-10: Excellent fit, journal actively seeks this
- 7-8: Good fit, compatible
- 5-6: Neutral, neither match nor mismatch
- 3-4: Weak fit, some tension
- 1-2: Poor fit, contradicts journal's editorial direction

---

## Journal Archetype Detection

Classify every journal into one of these types (or hybrid of 2):

| Archetype | Key signals |
|-----------|-------------|
| **Academic/Literary** | University press, MFA faculty on masthead, critical essays alongside poems, formal and experimental accepted |
| **Avant-Garde/Experimental** | Language poetry, visual poetry, conceptual work, "innovative" in mission, small press |
| **Mainstream Literary** | Wide readership, established reputation, Best American selections, accessible lyric |
| **Identity/Community** | Focused on specific identity, diaspora, or community voices, social justice themes |
| **Online/Emerging** | Web-only, newer publication, open to emerging voices, faster response times |
| **Chapbook/Book Press** | Publishes chapbooks or full-length collections, contest-based or open reading periods |
| **Theme/Ekphrastic** | Issues organized by theme, ekphrastic focus, interdisciplinary (art + poetry) |

After detecting archetype, read `modes/_profile.md` for the poet's specific strengths and framing for that journal type.

---

## Global Rules

### NEVER

1. Fabricate poems, credits, or bio details
2. Submit on behalf of the poet without explicit approval
3. Recommend submitting poems currently under exclusive review elsewhere
4. Ignore reading period dates (closed = closed)
5. Recommend journals with reading fees if poet has `no_reading_fees: true`
6. Generate a manuscript without reading the poem first

### ALWAYS

1. Read profile.yml and _profile.md before evaluating
2. Detect journal archetype and adapt evaluation per _profile.md
3. Verify the journal is currently accepting submissions (Playwright)
4. Check for simultaneous submission conflicts in submissions.md
5. Register in tracker after evaluating
6. Be direct and actionable -- no fluff
7. Respect the poet's voice -- never suggest changing the poem to fit the journal

### Tools

| Tool | Use |
|------|-----|
| WebSearch | Journal research, reading period status, editor info, Duotrope/Submittable data |
| WebFetch | Fallback for extracting guidelines from static pages |
| Playwright | Verify submission status (browser_navigate + browser_snapshot). Scrape guidelines. |
| Read | profile.yml, _profile.md, local poem files, reference database |
| Write | Reports, tracker entries, temporary HTML for manuscript |
| Bash | `node generate-manuscript.mjs` |

---

## Reference Database -- Top 1000 Lit Mags

**File:** `data/top-1000-lit-mags-2025.csv`

A ranked database of 1,126 literary magazines from the "Top 1000 Lit Mags 2025" dataset. Rankings are based on fiction/CNF prestige metrics (Best American, Pushcart, O'Henry, Best of the Net, Wigleaf, Best Small Fictions, Best Microfiction, PEN/Dau).

### Columns
`RANKING, Journal, Best American Short Stories, Best American Essays, Pushcart Fiction, Pushcart Non-Fiction, O'Henry Prize, PEN DAU, Best of the Net Fiction, Best of the Net Non-Fiction, Wigleaf, Best Small Fictions, Best Microfiction, Twitter Followers, Total Score, Open, Cost, Word Count, Print, Payment, Restrictions, Country, Twitter Handle`

### How to Use During Evaluation

1. **Cross-reference:** When evaluating a journal, search the CSV for it by name. If found:
   - Include its ranking and total score in the report under Payment/Prestige (Dimension 9)
   - Factor ranking into Credits Match (Dimension 6): top-50 journals expect established poets; 500+ are more open to emerging voices
   - Note submission cost, reading period, and payment info as corroboration or supplement to what's scraped from the site

2. **Prestige calibration:**
   - Rank 1-50: **Reach tier** — top-prestige, very competitive, expect prior credits
   - Rank 51-200: **Upper target** — strong journals, emerging poets with standout work can break in
   - Rank 201-500: **Target tier** — realistic for emerging poets with polished work
   - Rank 501+: **Foundation tier** — good for building credits, often more receptive to new voices

3. **Caveat:** Rankings are fiction/CNF-weighted. A journal ranked #800 for fiction may be excellent for poetry. Use ranking as one signal, not the whole picture. Always verify poetry-specific reputation via the journal's actual site and recent issues.

4. **Restrictions filter:** Check the `Restrictions` column. Skip journals marked with identity/demographic restrictions that don't apply, CNF-only, age-restricted, or geographically limited (unless the poet qualifies).
