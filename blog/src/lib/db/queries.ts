// TEAM_010: Blog DB queries for hubs and programmatic pages
// TEAM_030: Added formasi page queries

import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type { ContentBlock, FormationEntry, HubRecord, ProgrammaticPageRecord } from '../blogContent';
import { hubs, programmaticPages, formasiPages } from './schema';
import type { BlogDb } from './client';

const normalizeBlocks = (value: unknown): ContentBlock[] =>
  Array.isArray(value) ? (value as ContentBlock[]) : [];

const normalizeFormations = (value: unknown): FormationEntry[] | null =>
  Array.isArray(value) ? (value as FormationEntry[]) : null;

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
  formationsData: normalizeFormations(row.formationsData),
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

export const getProgrammaticPageBySlug = async (
  db: BlogDb,
  slug: string,
): Promise<ProgrammaticPageRecord | null> => {
  // TEAM_017: flat blog route (/blog/:slug) fetches page by globally-unique slug
  const rows = await db.select().from(programmaticPages).where(eq(programmaticPages.slug, slug)).limit(1);
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

export const getRelatedProgrammaticPagesForHub = async (
  db: BlogDb,
  hub: string,
  excludeSlug: string,
  limit: number,
): Promise<Array<Pick<ProgrammaticPageRecord, 'hub' | 'slug' | 'title' | 'updatedAt'>>> => {
  // TEAM_017: internal linking — related pages in the same hub
  const rows = await db
    .select({
      hub: programmaticPages.hub,
      slug: programmaticPages.slug,
      title: programmaticPages.title,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .where(and(eq(programmaticPages.hub, hub), sql`${programmaticPages.slug} <> ${excludeSlug}`))
    .orderBy(desc(programmaticPages.updatedAt))
    .limit(limit);

  return rows.map((row) => ({
    hub: row.hub,
    slug: row.slug,
    title: row.title,
    updatedAt: row.updatedAt ?? null,
  }));
};

export const getRecentProgrammaticPages = async (
  db: BlogDb,
  excludeId: string,
  limit: number,
): Promise<Array<Pick<ProgrammaticPageRecord, 'hub' | 'slug' | 'title' | 'updatedAt'>>> => {
  // TEAM_017: internal linking — cross-hub recent pages
  const rows = await db
    .select({
      hub: programmaticPages.hub,
      slug: programmaticPages.slug,
      title: programmaticPages.title,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .where(sql`${programmaticPages.id} <> ${excludeId}`)
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

// TEAM_031: Formasi hub category queries
export const getProgrammaticPagesByHub = async (
  db: BlogDb,
  hub: string,
  limit: number = 50,
): Promise<Pick<ProgrammaticPageRecord, 'slug' | 'title' | 'updatedAt'>[]> => {
  const rows = await db
    .select({
      slug: programmaticPages.slug,
      title: programmaticPages.title,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .where(eq(programmaticPages.hub, hub))
    .orderBy(desc(programmaticPages.updatedAt))
    .limit(limit);

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    updatedAt: row.updatedAt ?? null,
  }));
};

export type HubCategory = {
  hub: string;
  title: string;
  count: number;
};

export const getHubCategoriesWithCounts = async (db: BlogDb): Promise<HubCategory[]> => {
  const formasiHubs = ['provinsi', 'kota', 'institusi', 'pendidikan'];
  const results: HubCategory[] = [];

  for (const hubSlug of formasiHubs) {
    const hubRow = await getHubBySlug(db, hubSlug);
    if (!hubRow) continue;

    const countRows = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(programmaticPages)
      .where(eq(programmaticPages.hub, hubSlug));

    results.push({
      hub: hubSlug,
      title: hubRow.title,
      count: countRows[0]?.count ?? 0,
    });
  }

  return results;
};

// TEAM_030: Formasi page queries (deprecated - use programmatic_pages instead)
export type FormasiPageRecord = {
  id: string;
  slug: string;
  pageType: string;
  province: string | null;
  provinceSlug: string | null;
  city: string | null;
  citySlug: string | null;
  institution: string | null;
  institutionSlug: string | null;
  educationLevel: string | null;
  title: string;
  metaDescription: string | null;
  targetKeywords: string[];
  contentBlocks: ContentBlock[];
  formationsData: unknown;
  totalQuota: number | null;
  totalInstitutions: number | null;
  hasPlaceholderData: boolean;
  dataSource: string | null;
  updatedAt: Date | null;
};

const normalizeFormasiPage = (row: typeof formasiPages.$inferSelect): FormasiPageRecord => ({
  id: row.id,
  slug: row.slug,
  pageType: row.pageType,
  province: row.province ?? null,
  provinceSlug: row.provinceSlug ?? null,
  city: row.city ?? null,
  citySlug: row.citySlug ?? null,
  institution: row.institution ?? null,
  institutionSlug: row.institutionSlug ?? null,
  educationLevel: row.educationLevel ?? null,
  title: row.title,
  metaDescription: row.metaDescription ?? null,
  targetKeywords: Array.isArray(row.targetKeywords) ? row.targetKeywords as string[] : [],
  contentBlocks: normalizeBlocks(row.contentBlocks),
  formationsData: row.formationsData,
  totalQuota: row.totalQuota ?? null,
  totalInstitutions: row.totalInstitutions ?? null,
  hasPlaceholderData: row.hasPlaceholderData ?? true,
  dataSource: row.dataSource ?? null,
  updatedAt: row.updatedAt ?? null,
});

export const getFormasiPageBySlug = async (db: BlogDb, slug: string): Promise<FormasiPageRecord | null> => {
  const rows = await db.select().from(formasiPages).where(eq(formasiPages.slug, slug)).limit(1);
  if (!rows.length) return null;
  return normalizeFormasiPage(rows[0]);
};

export const getFormasiPagesByProvince = async (db: BlogDb, provinceSlug: string): Promise<FormasiPageRecord[]> => {
  const rows = await db
    .select()
    .from(formasiPages)
    .where(eq(formasiPages.provinceSlug, provinceSlug))
    .orderBy(formasiPages.city);
  return rows.map(normalizeFormasiPage);
};

export const getFormasiCitiesByProvince = async (
  db: BlogDb,
  provinceSlug: string,
): Promise<Array<{ slug: string; city: string; citySlug: string }>> => {
  const rows = await db
    .select({
      slug: formasiPages.slug,
      city: formasiPages.city,
      citySlug: formasiPages.citySlug,
    })
    .from(formasiPages)
    .where(and(eq(formasiPages.provinceSlug, provinceSlug), eq(formasiPages.pageType, 'city')));

  return rows
    .filter((row): row is { slug: string; city: string; citySlug: string } => Boolean(row.city && row.citySlug))
    .map((row) => ({
      slug: row.slug,
      city: row.city,
      citySlug: row.citySlug,
    }));
};

export const getAllFormasiProvinces = async (
  db: BlogDb,
): Promise<Array<{ slug: string; province: string; provinceSlug: string }>> => {
  const rows = await db
    .select({
      slug: formasiPages.slug,
      province: formasiPages.province,
      provinceSlug: formasiPages.provinceSlug,
    })
    .from(formasiPages)
    .where(eq(formasiPages.pageType, 'province'));

  return rows
    .filter((row): row is { slug: string; province: string; provinceSlug: string } =>
      Boolean(row.province && row.provinceSlug))
    .map((row) => ({
      slug: row.slug,
      province: row.province,
      provinceSlug: row.provinceSlug,
    }));
};

export const getAllFormasiInstitutions = async (
  db: BlogDb,
): Promise<Array<{ slug: string; institution: string; institutionSlug: string }>> => {
  const rows = await db
    .select({
      slug: formasiPages.slug,
      institution: formasiPages.institution,
      institutionSlug: formasiPages.institutionSlug,
    })
    .from(formasiPages)
    .where(eq(formasiPages.pageType, 'institution'));

  return rows
    .filter((row): row is { slug: string; institution: string; institutionSlug: string } =>
      Boolean(row.institution && row.institutionSlug))
    .map((row) => ({
      slug: row.slug,
      institution: row.institution,
      institutionSlug: row.institutionSlug,
    }));
};

export const getAllFormasiEducationLevels = async (
  db: BlogDb,
): Promise<Array<{ slug: string; educationLevel: string }>> => {
  const rows = await db
    .select({
      slug: formasiPages.slug,
      educationLevel: formasiPages.educationLevel,
    })
    .from(formasiPages)
    .where(eq(formasiPages.pageType, 'education'));

  return rows
    .filter((row): row is { slug: string; educationLevel: string } => Boolean(row.educationLevel))
    .map((row) => ({
      slug: row.slug,
      educationLevel: row.educationLevel,
    }));
};

// TEAM_032: Updated to use programmatic_pages with formasi hubs
export const getFormasiPageCount = async (db: BlogDb): Promise<number> => {
  const rows = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(programmaticPages)
    .where(inArray(programmaticPages.hub, ['provinsi', 'kota', 'institusi', 'pendidikan']));
  return rows[0]?.count ?? 0;
};

// TEAM_032: Updated to use programmatic_pages with formasi hubs
export const getFormasiPagesForSitemap = async (
  db: BlogDb,
  offset: number,
  limit: number,
): Promise<Array<{ slug: string; hub: string; updatedAt: Date | null }>> => {
  const rows = await db
    .select({
      slug: programmaticPages.slug,
      hub: programmaticPages.hub,
      updatedAt: programmaticPages.updatedAt,
    })
    .from(programmaticPages)
    .where(inArray(programmaticPages.hub, ['provinsi', 'kota', 'institusi', 'pendidikan']))
    .orderBy(desc(programmaticPages.updatedAt))
    .limit(limit)
    .offset(offset);

  return rows.map((row) => ({
    slug: row.slug,
    hub: row.hub,
    updatedAt: row.updatedAt ?? null,
  }));
};
