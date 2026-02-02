// TEAM_010: Blog DB queries for hubs and programmatic pages

import { and, desc, eq, sql } from 'drizzle-orm';
import type { ContentBlock, HubRecord, ProgrammaticPageRecord } from '../blogContent';
import { hubs, programmaticPages } from './schema';
import type { BlogDb } from './client';

const normalizeBlocks = (value: unknown): ContentBlock[] =>
  Array.isArray(value) ? (value as ContentBlock[]) : [];

const normalizePage = (row: typeof programmaticPages.$inferSelect): ProgrammaticPageRecord => ({
  id: row.id,
  hub: row.hub,
  slug: row.slug,
  keyword: row.keyword,
  intent: row.intent,
  title: row.title,
  metaDescription: row.metaDescription ?? null,
  h1: row.h1,
  contentBlocks: normalizeBlocks(row.contentBlocks),
  updatedAt: row.updatedAt ?? null,
});

export const getHubs = async (db: BlogDb): Promise<HubRecord[]> => {
  const rows = await db.select().from(hubs).orderBy(hubs.slug);
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    metaDescription: row.metaDescription ?? null,
    introduction: row.introduction ?? null,
  }));
};

export const getHubBySlug = async (db: BlogDb, slug: string): Promise<HubRecord | null> => {
  const rows = await db.select().from(hubs).where(eq(hubs.slug, slug)).limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  return {
    slug: row.slug,
    title: row.title,
    metaDescription: row.metaDescription ?? null,
    introduction: row.introduction ?? null,
  };
};

export const getProgrammaticPage = async (
  db: BlogDb,
  hub: string,
  slug: string,
): Promise<ProgrammaticPageRecord | null> => {
  const rows = await db
    .select()
    .from(programmaticPages)
    .where(and(eq(programmaticPages.hub, hub), eq(programmaticPages.slug, slug)))
    .limit(1);
  if (!rows.length) return null;
  return normalizePage(rows[0]);
};

export const getRecentProgrammaticPagesForHub = async (
  db: BlogDb,
  hub: string,
  limit: number,
): Promise<Pick<ProgrammaticPageRecord, 'hub' | 'slug' | 'title' | 'updatedAt'>[]> => {
  const rows = await db
    .select({
      hub: programmaticPages.hub,
      slug: programmaticPages.slug,
      title: programmaticPages.title,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .where(eq(programmaticPages.hub, hub))
    .orderBy(desc(programmaticPages.updatedAt))
    .limit(limit);

  return rows.map((row) => ({
    hub: row.hub,
    slug: row.slug,
    title: row.title,
    updatedAt: row.updatedAt ?? null,
  }));
};

export const getProgrammaticPageCount = async (db: BlogDb): Promise<number> => {
  const rows = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(programmaticPages);
  return rows[0]?.count ?? 0;
};

export const getProgrammaticPagesForSitemap = async (
  db: BlogDb,
  offset: number,
  limit: number,
): Promise<Array<{ hub: string; slug: string; updatedAt: Date | null }>> => {
  const rows = await db
    .select({
      hub: programmaticPages.hub,
      slug: programmaticPages.slug,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .orderBy(desc(programmaticPages.updatedAt))
    .limit(limit)
    .offset(offset);

  return rows.map((row) => ({
    hub: row.hub,
    slug: row.slug,
    updatedAt: row.updatedAt ?? null,
  }));
};
