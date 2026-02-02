// TEAM_010: cache-control helpers for Cloudflare edge caching

export const HUB_CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';
export const PROGRAMMATIC_CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=604800';
export const SITEMAP_CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';

export const setCacheControl = (headers: Headers, value: string) => {
  headers.set('Cache-Control', value);
  headers.set('CDN-Cache-Control', value);
};
