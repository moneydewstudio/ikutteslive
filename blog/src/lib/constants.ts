// TEAM_010: shared constants for blog domain rules
 
// TEAM_015: blog is served under the main domain path (/blog)
export const BLOG_SITE_URL = 'https://ikuttes.my.id';
export const BLOG_BASE_PATH = '/blog';
export const MAIN_APP_URL = 'https://ikuttes.my.id/';

export const HUB_SLUGS = ['tiu', 'twk', 'tkp'] as const;
export type HubSlug = (typeof HUB_SLUGS)[number];
