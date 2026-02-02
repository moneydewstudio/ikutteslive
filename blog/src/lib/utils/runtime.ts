// TEAM_010: runtime env resolver for Astro SSR on Cloudflare

export type RuntimeEnv = Record<string, string | undefined>;

export const getRuntimeEnv = (locals?: {
  runtime?: {
    env?: RuntimeEnv;
  };
}): RuntimeEnv => {
  if (locals?.runtime?.env) {
    return locals.runtime.env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env as RuntimeEnv;
  }
  return import.meta.env as unknown as RuntimeEnv;
};
