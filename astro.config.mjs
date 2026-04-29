import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

// Sitemap is hand-rolled at src/pages/sitemap-index.xml.ts and
// src/pages/sitemap-0.xml.ts so we can emit per-URL lastmod values
// computed from each protocol's listed_at.
export default defineConfig({
  site: 'https://dappdefi.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false }), pagefind()],
  build: {
    format: 'directory',
  },
});
