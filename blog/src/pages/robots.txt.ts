// TEAM_010: robots.txt for blog SEO surface

import type { APIRoute } from 'astro';
import { BLOG_SITE_URL } from '../lib/constants';
import { SITEMAP_CACHE_CONTROL, setCacheControl } from '../lib/utils/cache';

export const GET: APIRoute = async () => {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${BLOG_SITE_URL}/sitemap.xml\n`;
  const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
  setCacheControl(headers, SITEMAP_CACHE_CONTROL);
  return new Response(body, { headers });
};
