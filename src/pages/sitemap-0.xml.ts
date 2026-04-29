import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES } from '../data/categories';

// Hand-rolled sitemap with per-URL lastmod values:
//   - homepage:     build time
//   - category:     max(listed_at) of protocols in the category
//   - chain:        max(listed_at) of protocols on the chain
//   - protocol:     listed_at (the protocol's own date)
//   - rss / static: build time
//
// Priority and changefreq mirror what we previously emitted via
// @astrojs/sitemap so search engines see the same hierarchy.
function chainSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
type Url = { loc: string; lastmod: string; changefreq: string; priority: string };
function fmt(date: Date): string {
  return date.toISOString();
}
function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET({ site }: APIContext) {
  const base = (site ?? new URL('https://dappdefi.com')).toString().replace(/\/$/, '');
  const protocols = await getCollection('protocols');
  const buildTime = fmt(new Date());

  const urls: Url[] = [];

  // Homepage
  urls.push({ loc: `${base}/`, lastmod: buildTime, changefreq: 'daily', priority: '1.0' });

  // Categories — lastmod = newest listed_at in that category
  for (const cat of CATEGORIES) {
    const inCat = protocols.filter((p) => p.data.category === cat.slug);
    if (inCat.length === 0) continue;
    const newest = inCat.reduce((acc, p) => (p.data.listed_at > acc ? p.data.listed_at : acc), inCat[0].data.listed_at);
    urls.push({
      loc: `${base}/categories/${cat.slug}/`,
      lastmod: fmt(newest),
      changefreq: 'weekly',
      priority: '0.9',
    });
  }

  // Chains — lastmod = newest listed_at among protocols on that chain
  const chainNewest = new Map<string, Date>(); // chain slug → date
  const chainName = new Map<string, string>();
  for (const p of protocols) {
    for (const c of p.data.chains) {
      const slug = chainSlug(c);
      if (!slug) continue;
      const cur = chainNewest.get(slug);
      if (!cur || p.data.listed_at > cur) chainNewest.set(slug, p.data.listed_at);
      if (!chainName.has(slug)) chainName.set(slug, c);
    }
  }
  for (const [slug, date] of chainNewest.entries()) {
    urls.push({
      loc: `${base}/chains/${slug}/`,
      lastmod: fmt(date),
      changefreq: 'monthly',
      priority: '0.5',
    });
  }

  // Protocols — lastmod = the protocol's own listed_at
  for (const p of protocols) {
    urls.push({
      loc: `${base}/protocols/${p.slug}/`,
      lastmod: fmt(p.data.listed_at),
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${xmlEscape(u.loc)}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
