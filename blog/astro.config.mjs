import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// TEAM_010: configure Astro SSR on Cloudflare with Tailwind
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://blog.ikuttes.online',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
