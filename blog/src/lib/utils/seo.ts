// TEAM_010: SEO utilities for metadata, canonicals, and schema

import type { FaqItem } from '../blogContent';
import { BLOG_BASE_PATH, BLOG_SITE_URL } from '../constants';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type SeoConfig = {
  title: string;
  description?: string | null;
  canonicalPath: string;
  noindex?: boolean;
  ogType?: string;
};

// TEAM_015: blog is served under the main domain path (/blog)
const SITE_URL = BLOG_SITE_URL;

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const withBasePath = (path: string) => {
  if (path === '/') return BLOG_BASE_PATH;
  return `${BLOG_BASE_PATH}${normalizePath(path)}`;
};

export const buildCanonicalUrl = (path: string): string => {
  return new URL(withBasePath(path), SITE_URL).toString();
};

export const shouldNoIndex = (wordCount: number, description?: string | null): boolean => {
  if (!description) return true;
  return wordCount < 200;
};

export const buildRobotsContent = (noindex?: boolean): string => {
  return noindex ? 'noindex,follow' : 'index,follow';
};

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildCanonicalUrl(item.path),
  })),
});

export const buildSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ikuttes Blog',
  url: SITE_URL,
});

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ikuttes',
  url: SITE_URL,
});

export const buildWebPageSchema = (params: {
  title: string;
  description?: string | null;
  path: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: params.title,
  description: params.description ?? undefined,
  url: buildCanonicalUrl(params.path),
});

export const buildCollectionPageSchema = (params: {
  title: string;
  description?: string | null;
  path: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: params.title,
  description: params.description ?? undefined,
  url: buildCanonicalUrl(params.path),
});

export const buildArticleSchema = (params: {
  title: string;
  description?: string | null;
  path: string;
  updatedAt?: Date | null;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: params.title,
  description: params.description ?? undefined,
  url: buildCanonicalUrl(params.path),
  dateModified: params.updatedAt ? params.updatedAt.toISOString() : undefined,
  author: {
    '@type': 'Organization',
    name: 'Ikuttes',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Ikuttes',
  },
});

export const buildFaqSchema = (items: FaqItem[]) => {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
};

export const normalizeSeoConfig = (config: SeoConfig) => ({
  title: config.title,
  description: config.description ?? undefined,
  canonical: buildCanonicalUrl(config.canonicalPath),
  noindex: config.noindex ?? false,
  ogType: config.ogType ?? 'website',
});
