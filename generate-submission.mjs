#!/usr/bin/env node
/**
 * generate-submission.mjs
 *
 * Generates a .docx submission file from poems in data/poems.json.
 * Preserves all original formatting: line breaks, tabs, stanza breaks.
 *
 * Usage:
 *   node generate-submission.mjs --slugs slug1,slug2,slug3 --out output/file.docx [--blind] [--author "Name"]
 *
 * Options:
 *   --slugs    Comma-separated poem slugs
 *   --out      Output .docx path
 *   --blind    Omit author name (for blind reading journals like Rattle)
 *   --author   Author name (default: from profile.yml)
 */

import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { load } from 'js-yaml';

// Parse args
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}
const isBlind = args.includes('--blind');

const slugsRaw = getArg('slugs');
const outPath = getArg('out');

if (!slugsRaw || !outPath) {
  console.error('Usage: node generate-submission.mjs --slugs slug1,slug2 --out output/file.docx [--blind]');
  process.exit(1);
}

const slugs = slugsRaw.split(',').map(s => s.trim());

// Load poems
const poems = JSON.parse(readFileSync(new URL('./data/poems.json', import.meta.url), 'utf-8'));

// Load profile for author name
let authorName = getArg('author') || 'Author';
try {
  const profile = load(readFileSync(new URL('./config/profile.yml', import.meta.url), 'utf-8'));
  authorName = getArg('author') || profile.poet?.full_name || authorName;
} catch (e) { /* use default */ }

// Convert poem text to docx paragraphs, preserving all formatting
function poemToParagraphs(text) {
  const paragraphs = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.trim() === '') {
      // Stanza break — empty paragraph with spacing
      paragraphs.push(new Paragraph({
        spacing: { after: 120 },
        children: [],
      }));
    } else {
      // Preserve leading tabs/spaces
      paragraphs.push(new Paragraph({
        spacing: { after: 0, line: 276 }, // ~1.15 line spacing
        children: [
          new TextRun({
            text: line,
            font: 'Times New Roman',
            size: 24, // 12pt
          }),
        ],
      }));
    }
  }
  return paragraphs;
}

// Build document sections
const sections = [];

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const poem = poems.find(p => p.slug === slug);

  if (!poem) {
    console.error(`Poem not found: ${slug}`);
    process.exit(1);
  }

  const children = [];

  // Author name on first page only (unless blind)
  if (i === 0 && !isBlind) {
    children.push(new Paragraph({
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: authorName,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
    }));
  }

  // Title
  children.push(new Paragraph({
    spacing: { before: i === 0 ? 200 : 0, after: 300 },
    children: [
      new TextRun({
        text: poem.title,
        font: 'Times New Roman',
        size: 28, // 14pt
        bold: true,
      }),
    ],
  }));

  // Poem body
  children.push(...poemToParagraphs(poem.text));

  sections.push({
    properties: i > 0 ? { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } } :
      { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children,
  });
}

const doc = new Document({
  sections,
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(outPath, buffer);
console.log(`Generated: ${outPath} (${slugs.length} poem${slugs.length > 1 ? 's' : ''})`);
