/// <reference types="vite/client" />

// TEAM_002: declare Vite env vars so import.meta.env.VITE_API_BASE is type-safe and usable in production builds
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
