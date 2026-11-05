#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node verify-article.mjs <path-to-article.ts>');
  process.exit(1);
}

const fullPath = resolve(process.cwd(), filePath);
const content = readFileSync(fullPath, 'utf8');

const errors = [];
const warnings = [];

// 1. Required fields
const requiredFields = [
  'kind',
  'slug',
  'title',
  'description',
  'updated',
  'readingMinutes',
  'summary',
  'sections'
];

for (const field of requiredFields) {
  const regex = new RegExp(`\\b${field}\\s*:`);
  if (!regex.test(content)) {
    errors.push(`Missing required field: '${field}'`);
  }
}

// 2. Pricing token check: body text should not hardcode $5 or $12; must use {{price}}
const hardcodedPriceRegex = /["'`](?:[^"'`]*)\$\d+(?:[^"'`]*)["'`]/g;
let priceMatch;
while ((priceMatch = hardcodedPriceRegex.exec(content)) !== null) {
  const text = priceMatch[0];
  // Ignore comments or external URL references if any
  if (!text.includes('http') && !text.includes('//')) {
    errors.push(`Hardcoded dollar price found in text: ${text.trim()}. Use {{price}} instead.`);
  }
}

// 3. Em dashes or en dashes
const dashMatches = content.match(/[—–]/g);
if (dashMatches) {
  errors.push(`Found ${dashMatches.length} em/en dash(es). Simplified Technical English forbids dashes. Use separate sentences.`);
}

// 4. Semicolons in string literals
const stringRegex = /["'`]{1}([\s\S]*?)["'`]{1}/g;
let strMatch;
const forbiddenModals = /\b(should|would|could|may|might)\b/i;
const contractions = /\b([a-zA-Z]+'t|[a-zA-Z]+'ve|[a-zA-Z]+'re|[a-zA-Z]+'ll|[a-zA-Z]+'d|it's|let's)\b/i;
const forbiddenWords = [
  ['utilize', 'use'],
  ['employ', 'use'],
  ['commence', 'start'],
  ['initiate', 'start'],
  ['terminate', 'stop, end'],
  ['ensure', 'make sure that'],
  ['verify', 'make sure that'],
  ['confirm', 'make sure that'],
  ['perform', 'do'],
  ['execute', 'do'],
  ['obtain', 'get'],
  ['acquire', 'get'],
  ['sufficient', 'enough'],
  ['approximately', 'about'],
  ['prior to', 'before'],
  ['in order to', 'to'],
  ['due to', 'because of']
];

const lines = content.split('\n');
lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const trimmed = line.trim();

  // Only check lines with string content (p, html, text, summary, title, items)
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('import ')) {
    return;
  }

  // Check contractions
  const contMatch = line.match(contractions);
  if (contMatch && !line.includes('//') && !line.includes('http')) {
    // Exclude legitimate TS types or single quote escapes
    if (!['don\'t', 'can\'t', 'won\'t', 'it\'s'].some(c => line.includes(c))) {
      // General check
    }
  }

  if (forbiddenModals.test(line) && (line.includes('html:') || line.includes('text:') || line.includes('summary:'))) {
    errors.push(`Line ${lineNum}: Forbidden modal verb found (${line.match(forbiddenModals)[0]}). Use 'can', 'will', or 'must'.`);
  }

  for (const [forbidden, replacement] of forbiddenWords) {
    const wordRegex = new RegExp(`\\b${forbidden}\\b`, 'i');
    if (wordRegex.test(line) && (line.includes('html:') || line.includes('text:') || line.includes('items:'))) {
      errors.push(`Line ${lineNum}: Forbidden word '${forbidden}' found. Use '${replacement}'.`);
    }
  }

  // Check semicolon in copy
  if (line.includes(';') && (line.includes('html:') || line.includes('text:'))) {
    // Avoid checking html entities like &gt; or &amp;
    const withoutEntities = line.replace(/&[a-z0-9#]+;/gi, '');
    if (withoutEntities.includes(';') && !withoutEntities.trim().endsWith(';')) {
      errors.push(`Line ${lineNum}: Semicolon found inside prose text. Split into two short sentences.`);
    }
  }

  // Check contractions explicitly in prose lines
  const commonContractions = /\b(don't|can't|won't|it's|doesn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|you'll|they'll|we'll|I'll|you're|they're|we're)\b/i;
  const matchedContraction = line.match(commonContractions);
  if (matchedContraction && (line.includes('html:') || line.includes('text:') || line.includes('title:') || line.includes('summary:'))) {
    errors.push(`Line ${lineNum}: Contraction '${matchedContraction[0]}' found. Write the full words (e.g. 'do not', 'it is').`);
  }
});

// Check sentence length in extracted html/text strings
const textExtractRegex = /(?:html|text|summary):\s*(?:`([\s\S]*?)`|"([\s\S]*?)"|'([\s\S]*?)')/g;
let m;
while ((m = textExtractRegex.exec(content)) !== null) {
  const textContent = (m[1] || m[2] || m[3] || '').replace(/<[^>]+>/g, ' ');
  const sentences = textContent.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
  
  if (sentences.length > 6) {
    warnings.push(`A block has ${sentences.length} sentences (> 6). Consider splitting into multiple paragraphs.`);
  }

  for (const sentence of sentences) {
    const wordCount = sentence.split(/\s+/).filter(Boolean).length;
    if (wordCount > 25) {
      errors.push(`Sentence exceeds 25 words (${wordCount} words): "${sentence.slice(0, 60)}..."`);
    }
  }
}

console.log(`\n--- Verification results for ${filePath} ---`);
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Article complies with Pluckr Simplified Technical English & schema rules.\n');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:`);
    errors.forEach(e => console.log(`  - ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ ${warnings.length} warning(s):`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  console.log('');
  if (errors.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}
