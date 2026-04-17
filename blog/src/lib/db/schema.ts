// TEAM_010: Blog Neon schema for hubs and programmatic pages

import { jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import type { ContentBlock, ProgrammaticIntent } from '../blogContent';

export const hubs = pgTable('hubs', {
  slug: varchar('slug', { length: 10 }).primaryKey(),
  title: varchar('title', { length: 120 }).notNull(),
  metaDescription: varchar('meta_description', { length: 160 }),
  introduction: text('introduction'),
});

export const programmaticPages = pgTable('programmatic_pages', {
  id: text('id').primaryKey(),
  hub: varchar('hub', { length: 10 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  keyword: varchar('keyword', { length: 255 }).notNull(),
  intent: varchar('intent', { length: 20 }).$type<ProgrammaticIntent>().notNull(),
  title: varchar('title', { length: 120 }).notNull(),
  metaDescription: varchar('meta_description', { length: 160 }),
  h1: varchar('h1', { length: 120 }).notNull(),
  contentBlocks: jsonb('content_blocks').$type<ContentBlock[]>().notNull(),
  formationsData: jsonb('formations_data'), // TEAM_031: formation tables for CPNS pages
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// TEAM_030: Formasi CPNS programmatic pages (province, city, institution, education)
export const formasiPages = pgTable('formasi_pages', {
  id: text('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  pageType: varchar('page_type', { length: 20 }).notNull(), // 'province', 'city', 'institution', 'education'
  // Location fields
  province: varchar('province', { length: 100 }),
  provinceSlug: varchar('province_slug', { length: 100 }),
  city: varchar('city', { length: 100 }),
  citySlug: varchar('city_slug', { length: 100 }),
  // Institution field
  institution: varchar('institution', { length: 100 }),
  institutionSlug: varchar('institution_slug', { length: 100 }),
  // Education field
  educationLevel: varchar('education_level', { length: 50 }),
  // SEO
  title: varchar('title', { length: 120 }).notNull(),
  metaDescription: varchar('meta_description', { length: 160 }),
  targetKeywords: jsonb('target_keywords').$type<string[]>(),
  // Content
  contentBlocks: jsonb('content_blocks').$type<ContentBlock[]>().notNull(),
  // Formation data
  formationsData: jsonb('formations_data'), // simplified formation array
  // Stats
  totalQuota: jsonb('total_quota').$type<number>(),
  totalInstitutions: jsonb('total_institutions').$type<number>(),
  // Placeholder tracking
  hasPlaceholderData: jsonb('has_placeholder_data').$type<boolean>().default(true),
  dataSource: varchar('data_source', { length: 50 }), // 'BKN 2024', 'Template', 'Manual'
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
