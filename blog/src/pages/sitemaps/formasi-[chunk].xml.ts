// TEAM_030: dynamic sitemap for formasi pages

import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db/client';
import { getFormasiPageCount, getFormasiPagesForSitemap } from '../../lib/db/queries';
import { getRuntimeEnv } from '../../lib/utils/runtime';
import { buildSitemapXml } from '../../lib/utils/sitemap';
import { BLOG_BASE_PATH, BLOG_SITE_URL } from '../../lib/constants';
import { SITEMAP_CACHE_CONTROL, setCacheControl } from '../../lib/utils/cache';

const MAX_URLS_PER_SITEMAP = 50000;

export const GET: APIRoute = async (context) => {
  const env = getRuntimeEnv(context.locals);
  const db = getDb(env);

  const chunk = parseInt(context.params.chunk ?? '1', 10);
  if (Number.isNaN(chunk) || chunk < 1) {
    return new Response('Invalid chunk', { status: 400 });
  }

  const totalCount = await getFormasiPageCount(db);
  const totalChunks = Math.max(1, Math.ceil(totalCount / MAX_URLS_PER_SITEMAP));

  if (chunk > totalChunks) {
    return new Response('Not found', { status: 404 });
  }

  const offset = (chunk - 1) * MAX_URLS_PER_SITEMAP;
  const limit = MAX_URLS_PER_SITEMAP;

  const rows = await getFormasiPagesForSitemap(db, offset, limit);

  const urls = rows.map((row) => ({
    loc: `${BLOG_SITE_URL}${BLOG_BASE_PATH}/formasi/${row.hub}/${row.slug}`,
    lastmod: row.updatedAt ? new Date(row.updatedAt).toISOString().slice(0, 10) : undefined,
  }));

  // Add formasi hub page as first entry
  urls.unshift({
    loc: `${BLOG_SITE_URL}${BLOG_BASE_PATH}/formasi`,
    lastmod: undefined,
  });

  const body = buildSitemapXml(urls);
  const headers = new Headers({ 'Content-Type': 'application/xml; charset=utf-8' });
  setCacheControl(headers, SITEMAP_CACHE_CONTROL);

  return new Response(body, { headers });
};

export function getStaticPaths() {
  // Pre-generate paths for chunks 1-2 (enough for 100k formasi pages)
  return [{ params: { chunk: '1' } }, { params: { chunk: '2' } }];
}
