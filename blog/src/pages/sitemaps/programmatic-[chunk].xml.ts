// TEAM_010: programmatic sitemap chunk (<= 50k URLs) generated from Neon

import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db/client';
import { getProgrammaticPagesForSitemap, getProgrammaticPageCount } from '../../lib/db/queries';
import { getRuntimeEnv } from '../../lib/utils/runtime';
import { buildSitemapXml } from '../../lib/utils/sitemap';
import { BLOG_BASE_PATH, BLOG_SITE_URL } from '../../lib/constants';
import { SITEMAP_CACHE_CONTROL, setCacheControl } from '../../lib/utils/cache';

const MAX_URLS_PER_SITEMAP = 50000;

export const GET: APIRoute = async (context) => {
  const chunkRaw = context.params.chunk;
  const chunk = Number(chunkRaw);
  if (!chunkRaw || Number.isNaN(chunk) || chunk < 1) {
    return new Response('Not found', { status: 404 });
  }

  const env = getRuntimeEnv(context.locals);
  const db = getDb(env);

  const totalCount = await getProgrammaticPageCount(db);
  const totalSitemaps = Math.max(1, Math.ceil(totalCount / MAX_URLS_PER_SITEMAP));
  if (chunk > totalSitemaps) {
    return new Response('Not found', { status: 404 });
  }

  const offset = (chunk - 1) * MAX_URLS_PER_SITEMAP;
  const rows = await getProgrammaticPagesForSitemap(db, offset, MAX_URLS_PER_SITEMAP);

  const entries = rows.map((row) => ({
    // TEAM_017: flat posts are served at /blog/:slug
    loc: `${BLOG_SITE_URL}${BLOG_BASE_PATH}/${row.slug}`,
    lastmod: row.updatedAt ? row.updatedAt.toISOString() : undefined,
  }));

  const body = buildSitemapXml(entries);
  const headers = new Headers({ 'Content-Type': 'application/xml; charset=utf-8' });
  setCacheControl(headers, SITEMAP_CACHE_CONTROL);

  return new Response(body, { headers });
};
