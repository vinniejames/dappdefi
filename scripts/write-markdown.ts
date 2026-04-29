#!/usr/bin/env tsx
/**
 * Read enriched protocol JSON from stdin, write src/content/protocols/{slug}.md.
 * Refuses to overwrite. Removes the matching entry from .cache/queue.json on success.
 *
 * Input shape (validated with zod):
 * {
 *   "slug": "aave",
 *   "name": "Aave",
 *   "category": "lending",
 *   "subcategories": ["money-market", "overcollateralized"],
 *   "chains": ["Ethereum", "Polygon"],
 *   "url": "https://aave.com",
 *   "twitter": "aave",
 *   "github": "aave/aave-v3-core",
 *   "logo": "https://example.com/aave.jpg",
 *   "description": "...markdown body...",
 *   "tags": {
 *     "governance": "dao",
 *     "token": "AAVE",
 *     "audited": true,
 *     "open_source": true,
 *     "custody": "non-custodial",
 *     "permissions": "permissionless",
 *     "launched": 2020
 *   },
 *   "external_id": "aave",
 *   "listed_at_unix": 1606435200
 * }
 */
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { CATEGORY_SLUGS, isValidSubcategory } from '../src/data/categories.ts';
import type { CategorySlug } from '../src/data/categories.ts';

const InputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/, 'slug must be lowercase kebab-case'),
  name: z.string().min(1),
  category: z.enum(CATEGORY_SLUGS as unknown as [string, ...string[]]),
  subcategories: z.array(z.string()).max(3),
  chains: z.array(z.string()).min(1),
  url: z.string().url(),
  twitter: z.string().nullable().default(null),
  github: z.string().nullable().default(null),
  logo: z.string().url().nullable().default(null),
  description: z.string().min(20, 'description too short — write 2-3 paragraphs'),
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
  const currentYear = new Date().getUTCFullYear();
  if (launched === 'unknown') return 'growing';
  if (launched >= currentYear - 1) return 'new';
  if (currentYear - launched >= 3 && chains.length >= 3) return 'established';
  return 'growing';
}

function yamlEscape(v: string): string {
  // Quote if contains characters that would confuse YAML
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

function popFromQueue(slug: string) {
  const queuePath = path.join(process.cwd(), '.cache', 'queue.json');
  if (!fs.existsSync(queuePath)) return;
  const raw = fs.readFileSync(queuePath, 'utf-8');
  const queue = JSON.parse(raw) as Array<{ slug: string }>;
  const filtered = queue.filter((q) => q.slug !== slug);
  if (filtered.length === queue.length) return;
  const tmp = `${queuePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(filtered, null, 2));
  fs.renameSync(tmp, queuePath);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf-8');
}

async function main() {
  const raw = await readStdin();
  if (!raw.trim()) {
    console.error('write-markdown: empty stdin. Pipe a JSON object.');
    process.exit(1);
  }
  const parsed = InputSchema.parse(JSON.parse(raw));

  // validate subcategories against the canonical vocabulary
  for (const sub of parsed.subcategories) {
    if (!isValidSubcategory(parsed.category as CategorySlug, sub)) {
      console.error(
        `write-markdown: subcategory "${sub}" is not in the allowed list for category "${parsed.category}".`,
      );
      process.exit(2);
    }
  }

  const protocolsDir = path.join(process.cwd(), 'src', 'content', 'protocols');
  fs.mkdirSync(protocolsDir, { recursive: true });
  const file = path.join(protocolsDir, `${parsed.slug}.md`);
  if (fs.existsSync(file)) {
    console.error(`write-markdown: refuse to overwrite ${file}`);
    process.exit(3);
  }

  const body = parsed.description.trim();
  const content = `${frontmatter(parsed)}\n\n## Overview\n\n${body}\n`;

  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);

  popFromQueue(parsed.slug);
  console.log(`write-markdown: wrote ${file}`);
}

main().catch((err) => {
  if (err instanceof z.ZodError) {
    console.error('write-markdown: validation failed');
    console.error(err.format());
  } else {
    console.error(err);
  }
  process.exit(1);
});
