// TEAM_033: runtime env resolver for Astro SSR on Cloudflare + dev mode

export type RuntimeEnv = Record<string, string | undefined>;

export const getRuntimeEnv = (locals?: {
  runtime?: {
    env?: RuntimeEnv;
  };
}): RuntimeEnv => {
  // Cloudflare Pages production
  if (locals?.runtime?.env) {
    return locals.runtime.env;
  }
  // Node.js dev mode - load from process.env
  if (typeof process !== 'undefined' && process.env?.NEON_DATABASE_URL) {
    return process.env as RuntimeEnv;
  }
  // Vite import.meta.env fallback
  try {
    const viteEnv = (import.meta as any).env;
    if (viteEnv?.NEON_DATABASE_URL) {
      return viteEnv as RuntimeEnv;
    }
  } catch {
    // ignore
  }
  return {};
};
