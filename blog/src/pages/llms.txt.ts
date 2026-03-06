// TEAM_017: llms.txt for blog LLM access guidance

import type { APIRoute } from 'astro';
import { BLOG_BASE_PATH, BLOG_SITE_URL } from '../lib/constants';
import { SITEMAP_CACHE_CONTROL, setCacheControl } from '../lib/utils/cache';

export const GET: APIRoute = async () => {
  const body = [
    '# Ikuttes Blog — LLM access',
    `site: ${BLOG_SITE_URL}${BLOG_BASE_PATH}`,
    '',
    '# Entry points',
    `sitemap: ${BLOG_SITE_URL}${BLOG_BASE_PATH}/sitemap.xml`,
    `robots: ${BLOG_SITE_URL}${BLOG_BASE_PATH}/robots.txt`,
    '',
    '# Allowed',
    `allow: ${BLOG_BASE_PATH}/`,
    '',
  ].join('\n');

  const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
  setCacheControl(headers, SITEMAP_CACHE_CONTROL);

  return new Response(body, { headers });
};
