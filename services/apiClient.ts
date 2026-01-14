import { authService } from './authService';

// TEAM_001: prevent deployed builds from defaulting API calls to localhost
const API_BASE = (() => {
  const envBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
  if (envBase) return envBase;

  // If this is running on a deployed host, default to the deployed API Worker.
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host.endsWith('workers.dev') || host.endsWith('pages.dev')) {
      return 'https://ikuttes.robimaulanaspsi.workers.dev';
    }
  }

  return 'http://localhost:8787';
})();

export async function apiFetch(path: string, init: RequestInit = {}) {
  // TEAM_001: make client fetch resilient (extensions/adblock/network) and log actionable context
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');

  try {
    const token = await authService.getIdToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  } catch (e) {
    console.warn('Failed to get auth token; proceeding without Authorization header:', e);
  }

  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { ...init, headers });
    return res;
  } catch (e) {
    console.error('apiFetch failed:', { url, error: e });
    throw e;
  }
}
