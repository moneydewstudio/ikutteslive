import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// TEAM_010: configure Astro SSR on Cloudflare with Tailwind
// TEAM_016: disable Cloudflare adapter during `astro dev` to avoid Windows Node runtime crashes (write EOF)
const command = process.argv[2];
const useCloudflareAdapter = command !== 'dev';

export default defineConfig({
  // TEAM_015: serve the blog under the main domain path (/blog) instead of a separate subdomain
  site: 'https://ikuttes.my.id',
  base: '/blog/',
  output: 'server',
  adapter: useCloudflareAdapter ? cloudflare() : undefined,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
