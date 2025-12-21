import { apiFetch } from './apiClient';

export async function syncAuth() {
  const res = await apiFetch('/auth/sync', { method: 'POST' });
  if (!res.ok) throw new Error('Auth sync failed');
  return res.json();
}

export type ExplanationResponse = { explanation: string } | { error: string } | { status: 'locked'; preview: string };

export async function getExplanation(questionId: string): Promise<ExplanationResponse> {
  const res = await apiFetch(`/explanations/${encodeURIComponent(questionId)}`);
  if (res.status === 403) {
    try { return await res.json(); } catch { return { status: 'locked', preview: 'Upgrade required' }; }
  }
  if (!res.ok) throw new Error('Failed to load explanation');
  return res.json();
}
