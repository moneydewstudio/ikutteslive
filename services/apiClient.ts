import { authService } from './authService';

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:8787';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await authService.getIdToken();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  return res;
}
