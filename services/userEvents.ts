import { apiFetch } from './apiClient';

export async function recordAnswerEvent(args: { questionId: string; isCorrect: boolean }): Promise<void> {
  const res = await apiFetch('/events/answer', {
    method: 'POST',
    body: JSON.stringify({ questionId: args.questionId, isCorrect: args.isCorrect }),
  });

  if (!res.ok) {
    throw new Error('Failed to record answer event');
  }
}
