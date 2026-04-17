# Mode: manuscript -- Submission Document Generation

## Output Formats

**Default output: .docx** (via pandoc). Most journals accept .docx. Generate .pdf only when a journal specifically requires it.

- **Multi-poem submissions:** One .docx file containing all poems for that journal, separated by page breaks
- **Blind submissions:** Omit author name/contact from the file entirely (e.g., Rattle)
- **Standard submissions:** Include author name at top of document
- **Filename convention:** `{author-name}-{journal-slug}-submission.docx` (or `{journal-slug}-submission.docx` for blind)

## Formatting Rules (CRITICAL)

**ALWAYS preserve the poet's original formatting exactly as it appears in `data/poems.json`:**

- **Line breaks:** Every `\n` in the poem text is an intentional line break. Preserve them.
- **Stanza breaks:** Consecutive blank lines = stanza break. Preserve spacing.
- **Enjambment:** Never reflow or rewrap lines. The poet's line breaks ARE the poem.
- **Indentation/tabs:** Preserve any leading whitespace.
- **No reformatting:** Do not convert free verse to prose or vice versa.

## Shunn Format (when requested or for formal journals)

William Shunn's standard manuscript format:

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

1. Read poem content from `data/poems.json` (by slug). Fallback: website URL or local file.
2. Read `config/profile.yml` for poet details (name, address, email, bio)
3. Detect line count and stanza breaks
4. Check if journal has special formatting requirements (from evaluation report if exists)
5. Generate markdown source with preserved line breaks (use `  \n` for markdown line breaks)
6. Convert to .docx via pandoc: `pandoc source.md -o output.docx`
7. For PDF (if journal requires): convert .docx to PDF via word processor export, or use `generate-manuscript.mjs` for Shunn format
8. Report: file path, page count, line count

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
