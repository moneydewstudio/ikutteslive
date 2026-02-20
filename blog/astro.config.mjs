import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// TEAM_010: configure Astro SSR on Cloudflare with Tailwind
export default defineConfig({
  // TEAM_015: serve the blog under the main domain path (/blog) instead of a separate subdomain
  site: 'https://ikuttes.my.id',
  base: '/blog/',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
