import { authService } from './authService';

// TEAM_007: always target the deployed Worker when VITE_API_BASE is missing (no localhost fallback)
const API_BASE = import.meta.env.VITE_API_BASE || 'https://ikuttes.robimaulanaspsi.workers.dev';

export async function apiFetch(path: string, init: RequestInit = {}) {
  if (!API_BASE) throw new Error('VITE_API_BASE is not configured');
  const token = await authService.getIdToken();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  return res;
}
