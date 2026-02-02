// TEAM_010: shared constants for blog domain rules

export const BLOG_SITE_URL = 'https://blog.ikuttes.online';
export const MAIN_APP_URL = 'https://ikuttes.online/';

export const HUB_SLUGS = ['tiu', 'twk', 'tkp'] as const;
export type HubSlug = (typeof HUB_SLUGS)[number];
