# Mode: manuscript -- Shunn-Formatted PDF Generation

## What is Shunn Format

William Shunn's standard manuscript format is the industry standard for poetry submissions. Key rules:

- **Font:** 12pt Courier or Courier New (monospaced)
- **Margins:** 1 inch on all sides
- **Header (first page):**
  - Top left: poet's legal name, address, email, phone (single-spaced)
  - Top right: line count (e.g., "32 lines")
- **Title block:** Centered, halfway down the first page
  - Poem title (all caps or mixed case, bold optional)
  - "by" on next line
  - Name as it should appear in publication (pen name or legal name)
- **Body:** Left-aligned, single-spaced within stanzas, double-spaced between stanzas
- **Subsequent pages:** Header with "Last Name / TITLE KEYWORD / page number" right-aligned
- **End marker:** Centered, after last line: a single "#" or "###"

## Pipeline

1. Read poem content (from website URL or local markdown file)
2. Read `config/profile.yml` for poet details (name, address, email)
3. Detect line count and stanza breaks
4. Check if journal has special formatting requirements (from evaluation report if exists)
5. Generate HTML using `templates/manuscript.html`
6. Write HTML to `/tmp/manuscript-{poem-slug}.html`
7. Execute: `node generate-manuscript.mjs /tmp/manuscript-{poem-slug}.html output/manuscript-{poem-slug}-{YYYY-MM-DD}.pdf --format={letter|a4}`
8. Report: PDF path, page count, line count

## Template Placeholders

| Placeholder | Content |
|-------------|---------|
| `{{POET_NAME}}` | Legal name (from profile.yml) |
| `{{POET_ADDRESS}}` | Mailing address |
| `{{POET_EMAIL}}` | Email |
| `{{LINE_COUNT}}` | Total line count (excluding blank stanza breaks) |
| `{{POEM_TITLE}}` | Title of the poem |
| `{{BYLINE_NAME}}` | Pen name or legal name |
| `{{POEM_BODY}}` | Formatted poem content |
| `{{HEADER_LAST_NAME}}` | Last name for running header |
| `{{HEADER_TITLE_KEYWORD}}` | First significant word of title (uppercase) |
| `{{PAGE_SIZE}}` | `letter` or `a4` |

## Formatting Rules

### Stanza Breaks
- Detect blank lines in the source poem
- Render as double line breaks in manuscript
- If a stanza break falls at a page break, add "[stanza break]" at top of next page

### Long Lines
- Do NOT break long lines arbitrarily
- If a line exceeds the margin, let it wrap naturally with a hanging indent
- Preserve the poet's line breaks exactly as written

### Special Characters
- Preserve em-dashes, en-dashes, smart quotes
- Ensure UTF-8 encoding
- Normalize any encoding issues for clean PDF output

### Epigraphs/Dedications
- If the poem has an epigraph, italicize it below the title
- Dedications: italicized, right-aligned below title

## Post-generation

Update tracker if the poem+journal pair exists: change Manuscript from pending to the PDF path.
