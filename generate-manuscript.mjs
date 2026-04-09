#!/usr/bin/env node

/**
 * generate-manuscript.mjs -- HTML -> PDF via Playwright
 *
 * Usage:
 *   node generate-manuscript.mjs <input.html> <output.pdf> [--format=letter|a4]
 *
 * Generates a Shunn-formatted poetry manuscript PDF from an HTML template.
 * Uses Chromium headless to render the HTML and produce a clean PDF.
 */

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { readFile, writeFile } from 'fs/promises';

async function generateManuscript() {
  const args = process.argv.slice(2);

  let inputPath, outputPath, format = 'letter';

  for (const arg of args) {
    if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
    } else if (!inputPath) {
      inputPath = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  if (!inputPath || !outputPath) {
    console.error('Usage: node generate-manuscript.mjs <input.html> <output.pdf> [--format=letter|a4]');
    process.exit(1);
  }

  inputPath = resolve(inputPath);
  outputPath = resolve(outputPath);

  const validFormats = ['a4', 'letter'];
  if (!validFormats.includes(format)) {
    console.error(`Invalid format "${format}". Use: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Format: ${format.toUpperCase()}`);

  const html = await readFile(inputPath, 'utf-8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle',
    baseURL: `file://${dirname(inputPath)}/`,
  });

  await page.evaluate(() => document.fonts.ready);

  // Shunn format uses 1-inch margins
  const pdfBuffer = await page.pdf({
    format: format,
    printBackground: false,
    margin: {
      top: '1in',
      right: '1in',
      bottom: '1in',
      left: '1in',
    },
    preferCSSPageSize: false,
  });

  await writeFile(outputPath, pdfBuffer);

  const pdfString = pdfBuffer.toString('latin1');
  const pageCount = (pdfString.match(/\/Type\s*\/Page[^s]/g) || []).length;

  await browser.close();

  console.log(`PDF generated: ${outputPath}`);
  console.log(`Pages: ${pageCount}`);
  console.log(`Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);

  return { outputPath, pageCount, size: pdfBuffer.length };
}

generateManuscript().catch((err) => {
  console.error('PDF generation failed:', err.message);
  process.exit(1);
});
