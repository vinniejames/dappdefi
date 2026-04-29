import { defineCollection, z } from 'astro:content';
import { CATEGORY_SLUGS } from '../data/categories';

const categoryEnum = z.enum(CATEGORY_SLUGS as unknown as [string, ...string[]]);

const tagsSchema = z.object({
  governance: z.enum(['dao', 'multisig', 'foundation', 'unknown']).default('unknown'),
  token: z.string().nullable().default(null),
  audited: z.union([z.boolean(), z.literal('unknown')]).default('unknown'),
  open_source: z.union([z.boolean(), z.literal('unknown')]).default('unknown'),
  custody: z.enum(['non-custodial', 'custodial', 'hybrid', 'unknown']).default('unknown'),
  permissions: z.enum(['permissionless', 'permissioned', 'hybrid', 'unknown']).default('unknown'),
  launched: z.union([z.number().int().min(2009).max(2100), z.literal('unknown')]).default('unknown'),
  maturity: z.enum(['established', 'growing', 'new']).optional(),
});

const sourceSchema = z.object({
  external: z.string().optional(),
});

const protocolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string().min(1),
    category: categoryEnum,
    subcategories: z.array(z.string()).default([]),
    chains: z.array(z.string()).min(1),
    url: z.string().url(),
    twitter: z.string().nullable().default(null),
    github: z.string().nullable().default(null),
    logo: z
      .string()
      .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), 'logo must be an absolute URL or a path starting with /')
      .nullable()
      .default(null),
    listed_at: z.coerce.date(),
    tags: tagsSchema,
    sources: z.array(sourceSchema).default([]),
  }),
});

export const collections = {
  protocols: protocolsCollection,
};
