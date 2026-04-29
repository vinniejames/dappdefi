#!/usr/bin/env tsx
/**
 * Toggle a protocol's outbound-link SEO policy.
 *
 *   tsx scripts/set-link-type.ts <follow|nofollow|sponsored> <slug> [slug2 ...]
 *
 * Edits the protocol's markdown frontmatter in place. If the
 * `link_type:` line is missing, it's added directly under `listed_at:`.
 * If present, it's updated.
 *
 * Examples:
 *   npm run link-policy follow rocko kairos
 *   npm run link-policy nofollow some-old-feature
 *   npm run link-policy sponsored paid-listing
 */
import fs from 'node:fs';
import path from 'node:path';

const VALID = new Set(['follow', 'nofollow', 'sponsored']);
const PROTOCOLS_DIR = path.join(process.cwd(), 'src', 'content', 'protocols');

function usage(msg?: string): never {
  if (msg) console.error(`error: ${msg}\n`);
  console.error('Usage: npm run link-policy <follow|nofollow|sponsored> <slug> [slug2 ...]');
  process.exit(1);
}

const [policy, ...slugs] = process.argv.slice(2);
if (!policy || !VALID.has(policy)) usage(`invalid policy "${policy ?? ''}". Must be one of: ${[...VALID].join(', ')}`);
if (slugs.length === 0) usage('at least one slug required');

let changed = 0;
let unchanged = 0;
const missing: string[] = [];

for (const slug of slugs) {
  const file = path.join(PROTOCOLS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) {
    missing.push(slug);
    continue;
  }
  const original = fs.readFileSync(file, 'utf-8');
  // Operate on the frontmatter block only (everything between the
  // first two `---` markers). This is safer than a global regex if
  // the body ever contains the literal string "link_type:".
  const fmMatch = original.match(/^(---\n[\s\S]*?\n---)(\n[\s\S]*)?$/);
  if (!fmMatch) {
    console.warn(`! ${slug}: no frontmatter block, skipping`);
    continue;
  }
  const [, fm, rest = ''] = fmMatch;
  let newFm: string;
  if (/^link_type:.*$/m.test(fm)) {
    newFm = fm.replace(/^link_type:.*$/m, `link_type: ${policy}`);
  } else if (/^listed_at:.*$/m.test(fm)) {
    newFm = fm.replace(/^(listed_at:.*)$/m, `$1\nlink_type: ${policy}`);
  } else {
    // Fallback: insert just before the closing `---`.
    newFm = fm.replace(/\n---$/, `\nlink_type: ${policy}\n---`);
  }
  if (newFm === fm) {
    unchanged++;
    continue;
  }
  const next = `${newFm}${rest}`;
  // Atomic write.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, next);
  fs.renameSync(tmp, file);
  console.log(`✓ ${slug.padEnd(40)} → ${policy}`);
  changed++;
}

console.log('');
console.log(`link-policy: ${changed} changed, ${unchanged} already at "${policy}"${missing.length > 0 ? `, ${missing.length} not found` : ''}`);
if (missing.length > 0) {
  console.error('not found:');
  missing.forEach((s) => console.error(`  ${s}`));
  process.exit(2);
}
