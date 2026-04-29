import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

// site URL is set at deploy time; placeholder for local dev
export default defineConfig({
  site: 'https://example.github.io',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false }), pagefind()],
  build: {
    format: 'directory',
  },
});
