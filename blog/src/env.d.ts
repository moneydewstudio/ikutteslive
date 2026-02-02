/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
// TEAM_010: Astro env typing for blog runtime

interface ImportMetaEnv {
  readonly NEON_DATABASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
