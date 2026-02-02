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
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
