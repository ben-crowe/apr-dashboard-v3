#!/usr/bin/env node
// Codemod: convert hardcoded Tailwind colors in the dashboard to shadcn SEMANTIC TOKENS,
// which auto-respond to the .dark class (so no per-element dark: variants needed).
// Order matters: PAIRED forms ("bg-white dark:bg-gray-800") collapse to one token FIRST,
// then BARE light forms (the actual bug). Bare standalone dark bgs are left for manual review.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../src/components/dashboard/', import.meta.url).pathname;

// [regex, replacement] — applied in order. Paired (longest) first.
const RULES = [
  // ---- paired backgrounds → token ----
  [/bg-white dark:bg-gray-9\d0/g, 'bg-background'],
  [/bg-white dark:bg-gray-800(\/\d+)?/g, 'bg-card'],
  [/bg-white dark:bg-slate-800(\/\d+)?/g, 'bg-card'],
  [/bg-gray-50 dark:bg-gray-(800|900)(\/\d+)?/g, 'bg-muted'],
  [/bg-gray-100 dark:bg-gray-(700|800)(\/\d+)?/g, 'bg-muted'],
  // ---- paired text → token ----
  [/text-gray-900 dark:text-(white|gray-100)/g, 'text-foreground'],
  [/text-gray-800 dark:text-gray-(100|200)/g, 'text-foreground'],
  [/text-gray-700 dark:text-gray-(200|300)/g, 'text-foreground'],
  [/text-gray-600 dark:text-gray-(300|400)/g, 'text-muted-foreground'],
  [/text-gray-500 dark:text-gray-(400|500)/g, 'text-muted-foreground'],
  // ---- paired borders/divides → token ----
  [/border-gray-200 dark:border-gray-(700|800)/g, 'border-border'],
  [/border-gray-300 dark:border-gray-(600|700)/g, 'border-border'],
  [/divide-gray-200 dark:divide-gray-(700|800)/g, 'divide-border'],
  // ---- BARE light (no dark variant = the bug) → token ----
  [/\bbg-white\b(?!\/)/g, 'bg-card'],
  [/\bbg-gray-50\b/g, 'bg-muted'],
  [/\bbg-gray-100\b/g, 'bg-muted'],
  [/\btext-gray-900\b/g, 'text-foreground'],
  [/\btext-gray-700\b/g, 'text-foreground'],
  [/\btext-gray-600\b/g, 'text-muted-foreground'],
  [/\btext-gray-500\b/g, 'text-muted-foreground'],
  [/\bborder-gray-200\b/g, 'border-border'],
  [/\bborder-gray-300\b/g, 'border-border'],
];

function walk(dir) {
  let files = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (/\.(tsx|ts)$/.test(e)) files.push(p);
  }
  return files;
}

let changed = 0, edits = 0;
for (const f of walk(ROOT)) {
  let src = readFileSync(f, 'utf8');
  const before = src;
  for (const [re, to] of RULES) {
    src = src.replace(re, (m) => { edits++; return to; });
  }
  if (src !== before) { writeFileSync(f, src); changed++; }
}
console.log(`Converted ${edits} class occurrences across ${changed} files.`);
