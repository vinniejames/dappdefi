#!/usr/bin/env tsx
/**
 * Batch version of write-markdown. Reads a JSON ARRAY of enriched protocol
 * objects from stdin, writes each .md file, removes processed entries from
 * .cache/queue.json in one atomic update.
 *
 * Same per-entry validation as write-markdown.ts (zod, refuse-overwrite,
 * subcategory whitelist, atomic file write).
 *
 * Usage:
 *   cat batch.json | tsx scripts/write-batch.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { CATEGORY_SLUGS, isValidSubcategory } from '../src/data/categories.ts';
import type { CategorySlug } from '../src/data/categories.ts';

const InputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/),
  name: z.string().min(1),
  category: z.enum(CATEGORY_SLUGS as unknown as [string, ...string[]]),
  subcategories: z.array(z.string()).max(3),
  chains: z.array(z.string()).min(1),
  url: z.string().url(),
  twitter: z.string().nullable().default(null),
  github: z.string().nullable().default(null),
  logo: z.string().url().nullable().default(null),
  description: z.string().min(20),
  tags: z.object({
    governance: z.enum(['dao', 'multisig', 'foundation', 'unknown']),
    token: z.string().nullable(),
    audited: z.union([z.boolean(), z.literal('unknown')]),
    open_source: z.union([z.boolean(), z.literal('unknown')]),
    custody: z.enum(['non-custodial', 'custodial', 'hybrid', 'unknown']),
    permissions: z.enum(['permissionless', 'permissioned', 'hybrid', 'unknown']),
    launched: z.union([z.number().int().min(2009).max(2100), z.literal('unknown')]),
  }),
  external_id: z.string().optional(),
  listed_at_unix: z.number().nullable().optional(),
});
type Input = z.infer<typeof InputSchema>;

function computeMaturity(launched: number | 'unknown', chains: string[]): 'established' | 'growing' | 'new' {
  const y = new Date().getUTCFullYear();
  if (launched === 'unknown') return 'growing';
  if (launched >= y - 1) return 'new';
  if (y - launched >= 3 && chains.length >= 3) return 'established';
  return 'growing';
}

function yamlEscape(v: string): string {
  if (/^[A-Za-z0-9_./:-]+$/.test(v)) return v;
  return JSON.stringify(v);
}

function frontmatter(input: Input): string {
  const { tags } = input;
  const maturity = computeMaturity(tags.launched, input.chains);
  const listedAt = input.listed_at_unix
    ? new Date(input.listed_at_unix * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const lines: string[] = ['---'];
  lines.push(`name: ${yamlEscape(input.name)}`);
  lines.push(`slug: ${input.slug}`);
  lines.push(`category: ${input.category}`);
  if (input.subcategories.length > 0) {
    lines.push(`subcategories: [${input.subcategories.map(yamlEscape).join(', ')}]`);
  } else {
    lines.push('subcategories: []');
  }
  lines.push(`chains: [${input.chains.map(yamlEscape).join(', ')}]`);
  lines.push(`url: ${yamlEscape(input.url)}`);
  lines.push(`twitter: ${input.twitter ? yamlEscape(input.twitter) : 'null'}`);
  lines.push(`github: ${input.github ? yamlEscape(input.github) : 'null'}`);
  lines.push(`logo: ${input.logo ? yamlEscape(input.logo) : 'null'}`);
  lines.push(`listed_at: ${listedAt}`);
  lines.push('tags:');
  lines.push(`  governance: ${tags.governance}`);
  lines.push(`  token: ${tags.token ? yamlEscape(tags.token) : 'null'}`);
  lines.push(`  audited: ${tags.audited === 'unknown' ? 'unknown' : tags.audited}`);
  lines.push(`  open_source: ${tags.open_source === 'unknown' ? 'unknown' : tags.open_source}`);
  lines.push(`  custody: ${tags.custody}`);
  lines.push(`  permissions: ${tags.permissions}`);
  lines.push(`  launched: ${tags.launched}`);
  lines.push(`  maturity: ${maturity}`);
  if (input.external_id) {
    lines.push('sources:');
    lines.push(`  - external: ${yamlEscape(input.external_id)}`);
  } else {
    lines.push('sources: []');
  }
  lines.push('---');
  return lines.join('\n');
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf-8');
}

async function main() {
  const raw = await readStdin();
  if (!raw.trim()) {
    console.error('write-batch: empty stdin. Pipe a JSON array.');
    process.exit(1);
  }
  const arr = z.array(InputSchema).parse(JSON.parse(raw));
  const protocolsDir = path.join(process.cwd(), 'src', 'content', 'protocols');
  fs.mkdirSync(protocolsDir, { recursive: true });

  const written: string[] = [];
  const skipped: Array<{ slug: string; reason: string }> = [];

  for (const entry of arr) {
    const badSub = entry.subcategories.find(
      (s) => !isValidSubcategory(entry.category as CategorySlug, s),
    );
    if (badSub) {
      skipped.push({ slug: entry.slug, reason: `bad subcategory ${badSub} for ${entry.category}` });
      continue;
    }
    const file = path.join(protocolsDir, `${entry.slug}.md`);
    if (fs.existsSync(file)) {
      skipped.push({ slug: entry.slug, reason: 'already exists' });
      continue;
    }
    const body = entry.description.trim();
    const content = `${frontmatter(entry)}\n\n## Overview\n\n${body}\n`;
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, file);
    written.push(entry.slug);
  }

  // Update queue: remove all written slugs.
  const queuePath = path.join(process.cwd(), '.cache', 'queue.json');
  if (fs.existsSync(queuePath)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8')) as Array<{ slug: string }>;
    const writtenSet = new Set(written);
    const remaining = queue.filter((q) => !writtenSet.has(q.slug));
    const tmp = `${queuePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(remaining, null, 2));
    fs.renameSync(tmp, queuePath);
    console.log(`write-batch: wrote ${written.length}, skipped ${skipped.length}, queue remaining ${remaining.length}`);
  } else {
    console.log(`write-batch: wrote ${written.length}, skipped ${skipped.length} (no queue file)`);
  }

  if (skipped.length > 0) {
    console.log('write-batch: skipped:');
    skipped.forEach((s) => console.log(`  ${s.slug}: ${s.reason}`));
    process.exit(2);
  }
}

main().catch((err) => {
  if (err instanceof z.ZodError) {
    console.error('write-batch: validation failed');
    console.error(JSON.stringify(err.format(), null, 2));
  } else {
    console.error(err);
  }
  process.exit(1);
});
