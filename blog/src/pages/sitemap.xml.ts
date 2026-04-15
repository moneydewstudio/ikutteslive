// TEAM_010: dynamic sitemap index generated from Neon
// TEAM_030: added formasi pages sitemap

import type { APIRoute } from 'astro';
import { getDb } from '../lib/db/client';
import { getProgrammaticPageCount, getFormasiPageCount } from '../lib/db/queries';
import { getRuntimeEnv } from '../lib/utils/runtime';
import { buildSitemapIndexXml } from '../lib/utils/sitemap';
import { BLOG_BASE_PATH, BLOG_SITE_URL } from '../lib/constants';
import { SITEMAP_CACHE_CONTROL, setCacheControl } from '../lib/utils/cache';

const MAX_URLS_PER_SITEMAP = 50000;

export const GET: APIRoute = async (context) => {
  const env = getRuntimeEnv(context.locals);
  const db = getDb(env);

  const sitemaps: string[] = [];

  // Programmatic pages sitemaps
  const count = await getProgrammaticPageCount(db);
  const totalSitemaps = Math.max(1, Math.ceil(count / MAX_URLS_PER_SITEMAP));
  for (let i = 1; i <= totalSitemaps; i += 1) {
    // TEAM_015: blog is served under /blog
    sitemaps.push(`${BLOG_SITE_URL}${BLOG_BASE_PATH}/sitemaps/programmatic-${i}.xml`);
  }

  // TEAM_030: Formasi pages sitemaps
  const formasiCount = await getFormasiPageCount(db);
  const totalFormasiSitemaps = Math.max(1, Math.ceil(formasiCount / MAX_URLS_PER_SITEMAP));
  for (let i = 1; i <= totalFormasiSitemaps; i += 1) {
    sitemaps.push(`${BLOG_SITE_URL}${BLOG_BASE_PATH}/sitemaps/formasi-${i}.xml`);
  }

  const body = buildSitemapIndexXml(sitemaps);
  const headers = new Headers({ 'Content-Type': 'application/xml; charset=utf-8' });
  setCacheControl(headers, SITEMAP_CACHE_CONTROL);

  return new Response(body, { headers });
};
