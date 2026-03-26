// TEAM_010: cache-control helpers for Cloudflare edge caching

export const HUB_CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';
export const PROGRAMMATIC_CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=604800';
// TEAM_017: keep robots/sitemaps/llms.txt caching at <= 1h to avoid delayed crawl discovery
export const SITEMAP_CACHE_CONTROL = 'public, max-age=3600';
// TEAM_017: 404 pages should not be cached so new posts appear immediately after insert
export const NOT_FOUND_CACHE_CONTROL = 'no-store';

export const setCacheControl = (headers: Headers, value: string) => {
  headers.set('Cache-Control', value);
  headers.set('CDN-Cache-Control', value);
};
