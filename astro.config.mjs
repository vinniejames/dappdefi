import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dappdefi.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    pagefind(),
    sitemap({
      // Tell Google what's most important. Protocol detail and category
      // pages are the discoverable units; the homepage is the entry.
      // Lower priority on chain pages since they overlap a lot.
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://dappdefi.com/') return { ...item, priority: 1.0, changefreq: 'daily' };
        if (item.url.includes('/categories/')) return { ...item, priority: 0.9, changefreq: 'weekly' };
        if (item.url.includes('/protocols/')) return { ...item, priority: 0.8, changefreq: 'monthly' };
        if (item.url.includes('/chains/')) return { ...item, priority: 0.5, changefreq: 'monthly' };
        return item;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});
