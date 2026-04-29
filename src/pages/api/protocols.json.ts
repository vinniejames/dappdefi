import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORY_BY_SLUG } from '../../data/categories';

// Build-time manifest of every protocol with the fields the /compare/
// page needs. Served at /api/protocols.json — small enough (~120kb for
// 500 entries) to fetch once on the client and use for all comparisons
// without a round trip per protocol.
export async function GET(_ctx: APIContext) {
  const protocols = await getCollection('protocols');
  const data = protocols.map((p) => ({
    slug: p.slug,
    name: p.data.name,
    category: p.data.category,
    categoryName: CATEGORY_BY_SLUG[p.data.category]?.name ?? p.data.category,
    subcategories: p.data.subcategories,
    chains: p.data.chains,
    tags: p.data.tags,
    excerpt: (p.body ?? '').replace(/[#*_`>\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 280),
    url: p.data.url,
    logo: p.data.logo,
    listed_at: p.data.listed_at.toISOString(),
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
