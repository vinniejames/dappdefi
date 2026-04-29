import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { CATEGORY_BY_SLUG } from '../data/categories';
import type { APIContext } from 'astro';

// "Recently added" feed — the last 50 protocols by listed_at, descending.
// Useful for crawlers as a fresh-content signal and for power users who
// want to track what enters the directory.
export async function GET(context: APIContext) {
  const protocols = await getCollection('protocols');
  const items = protocols
    .sort((a, b) => +b.data.listed_at - +a.data.listed_at)
    .slice(0, 50)
    .map((p) => ({
      title: p.data.name,
      link: `/protocols/${p.slug}/`,
      pubDate: p.data.listed_at,
      description: `${p.data.name} — ${CATEGORY_BY_SLUG[p.data.category].name} on ${p.data.chains.slice(0, 3).join(', ')}.`,
      categories: [p.data.category, ...p.data.subcategories],
    }));

  return rss({
    title: 'Dapp DeFi — recently added',
    description: 'New DeFi protocols added to the Dapp DeFi directory.',
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
  });
}
