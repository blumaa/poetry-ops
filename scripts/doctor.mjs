#!/usr/bin/env node

/**
 * poetry-ops doctor — verify system dependencies and configuration
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const checks = [];

function check(name, fn) {
  try {
    const result = fn();
    checks.push({ name, ok: true, detail: result });
    console.log(`  ✓ ${name}${result ? ` (${result})` : ''}`);
  } catch (e) {
    checks.push({ name, ok: false, detail: e.message });
    console.log(`  ✗ ${name} — ${e.message}`);
  }
}

console.log('\npoetry-ops doctor\n');

// Node.js
check('Node.js >= 18', () => {
  const v = process.versions.node;
  const major = parseInt(v.split('.')[0]);
  if (major < 18) throw new Error(`Node ${v} found, need 18+`);
  return `v${v}`;
});

// Pandoc
check('pandoc installed', () => {
  const v = execSync('pandoc --version', { encoding: 'utf8' }).split('\n')[0];
  return v;
});

// Playwright
check('playwright chromium', () => {
  try {
    execSync('npx playwright install --dry-run chromium 2>&1', { encoding: 'utf8' });
    return 'available';
  } catch {
    throw new Error('run: npx playwright install chromium');
  }
});

// Profile
check('config/profile.yml exists', () => {
  const p = resolve(root, 'config/profile.yml');
  if (!existsSync(p)) throw new Error('copy config/profile.example.yml → config/profile.yml');
  return 'found';
});

// Profile content
check('profile.yml has real name', () => {
  const p = resolve(root, 'config/profile.yml');
  if (!existsSync(p)) throw new Error('profile.yml missing');
  const content = readFileSync(p, 'utf8');
  if (content.includes('Jane Smith')) throw new Error('still has example name — edit config/profile.yml');
  return 'configured';
});

// _profile.md
check('modes/_profile.md exists', () => {
  const p = resolve(root, 'modes/_profile.md');
  if (!existsSync(p)) throw new Error('create modes/_profile.md with your style identity');
  return 'found';
});

// Poems
check('poems data exists', () => {
  const json = resolve(root, 'data/poems.json');
  const csv = resolve(root, 'data/poem-catalog.csv');
  if (!existsSync(json) && !existsSync(csv)) throw new Error('add poems to data/poems.json or data/poem-catalog.csv');
  if (existsSync(json)) {
    const poems = JSON.parse(readFileSync(json, 'utf8'));
    return `${poems.length} poems`;
  }
  return 'catalog found';
});

// Submissions tracker
check('data/submissions.md exists', () => {
  const p = resolve(root, 'data/submissions.md');
  if (!existsSync(p)) throw new Error('will be created on first submission');
  return 'found';
});

// Summary
console.log('');
const failed = checks.filter(c => !c.ok);
if (failed.length === 0) {
  console.log('All checks passed. Ready to submit.\n');
} else {
  console.log(`${failed.length} issue(s) to fix:\n`);
  failed.forEach(f => console.log(`  → ${f.name}: ${f.detail}`));
  console.log('');
}

process.exit(failed.length > 0 ? 1 : 0);
