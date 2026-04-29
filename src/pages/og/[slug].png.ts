import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { CATEGORY_BY_SLUG } from '../../data/categories';

// Generate one 1200x630 OG image per protocol at build time. Astro
// emits these as static PNG files at /og/<slug>.png so they can be
// referenced from <meta property="og:image"> on the protocol page.

const protocols = await getCollection('protocols');
const pages = Object.fromEntries(protocols.map((p) => [p.slug, p]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'slug',
  pages,
  // The default `getSlug` adds a `.png` extension because it's designed
  // for routes named `[slug].ts`. Our route is `[slug].png.ts`, so the
  // extension is already in the file path — return the bare slug.
  getSlug: (path) => path,
  getImageOptions: (_path, p) => {
    const cat = CATEGORY_BY_SLUG[p.data.category];
    const chainList = p.data.chains.slice(0, 3).join(' · ') + (p.data.chains.length > 3 ? ` +${p.data.chains.length - 3}` : '');
    return {
      title: p.data.name,
      description: `${cat.name} · ${chainList}`,
      // Dark gradient that matches the site's dark theme (ink-900 → ink-700).
      bgGradient: [
        [11, 13, 15],
        [52, 58, 64],
      ],
      // Accent left bar (matches the .protocol-body lead style).
      border: {
        color: [99, 102, 241],
        width: 16,
        side: 'inline-start',
      },
      padding: 80,
      font: {
        title: { color: [248, 249, 250], size: 100, weight: 'Bold', lineHeight: 1.1 },
        description: { color: [173, 181, 189], size: 40, weight: 'Medium', lineHeight: 1.3 },
      },
    };
  },
});
