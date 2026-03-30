import { Question, UserSession } from '../types';
import { QUESTIONS_POOL } from '../constants';
import { apiFetch } from './apiClient';

// TEAM_001: make practice sessions use API-fetched questions (Neon via Worker) and store a session snapshot

// TEAM_004: support daily quiz sessions that rotate at Jakarta midnight via server-provided dayKey/refreshAt
// TEAM_005: daily drills helpers and storage (global, single-category rotation)

const SESSION_KEY = 'ikuttes_session_v1';
const DRILLS_SESSION_KEY = 'ikuttes_drills_session_v1';
const HISTORY_KEY = 'ikuttes_history_v1';

export const getRandomQuestions = (count: number = 5): Question[] => {
  // Simple shuffle
  const shuffled = [...QUESTIONS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getQuestionsByIds = (ids: string[]): Question[] => {
  return ids.map(id => QUESTIONS_POOL.find(q => q.id === id)).filter(Boolean) as Question[];
};

export const getQuestionsForSession = (session: UserSession): Question[] => {
  if (session.questions && session.questions.length > 0) {
    return session.questions;
  }
  return getQuestionsByIds(session.questionIds);
};

export const fetchRandomQuestionsFromApi = async (
  count: number = 5,
  category?: 'TIU' | 'TWK' | 'TKP'
): Promise<Question[]> => {
  const params = new URLSearchParams();
  params.set('limit', String(count));
  if (category) params.set('category', category);

  const res = await apiFetch(`/questions/random?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await res.json() as any[];
  return data.map(mapQuestionFromApi);
};

export const mapQuestionFromApi = (raw: any): Question => {
  const allowedSubjects: Array<Question['subject']> = ['TIU', 'TWK', 'TKP'];
  const subjectRaw = raw?.subject as string | null | undefined;
  const subject = allowedSubjects.includes(subjectRaw as any) ? (subjectRaw as Question['subject']) : 'TIU';

  let difficultyNum = Number(raw?.difficulty ?? 3);
  if (!Number.isFinite(difficultyNum)) difficultyNum = 3;
  difficultyNum = Math.min(5, Math.max(1, difficultyNum));

  const options = Array.isArray(raw?.options)
    ? raw.options.map((o: any) => ({
        id: String(o.id),
        text: String(o.text ?? ''),
      }))
    : [];

  const correctId = typeof raw?.correct_option_id === 'string' ? raw.correct_option_id : (options[0]?.id ?? '');

  return {
    id: String(raw?.id),
    subject,
    difficulty: difficultyNum as any,
    text: String(raw?.text ?? ''),
    options,
    correct_option_id: correctId,
    explanation: typeof raw?.explanation === 'string' ? raw.explanation : '',
    image_url: raw?.image_url ?? undefined,
  };
};

// TEAM_008: tryout API helpers should use the same apiFetch + parsing pattern as daily quiz/drills
const readJsonSafe = async <T,>(res: Response): Promise<T | null> => {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

export const startTryoutFromApi = async (): Promise<{ res: Response; data: any | null }> => {
  const res = await apiFetch('/exam/start', { method: 'POST', body: JSON.stringify({}) });
  const data = await readJsonSafe<any>(res);
  return { res, data };
};

export const fetchTryoutQuestionsFromApi = async (
  examId: string
): Promise<{ res: Response; questions: Question[]; raw: any | null }> => {
  const res = await apiFetch(`/exam/${encodeURIComponent(examId)}/questions`);
  const raw = await readJsonSafe<any>(res);
  const qRaw = Array.isArray(raw?.questions) ? raw.questions : [];
  return { res, raw, questions: qRaw.map(mapQuestionFromApi) };
};

export const submitTryoutFromApi = async (
  examId: string,
  answers: Record<string, string>
): Promise<{ res: Response; data: any | null }> => {
  const res = await apiFetch(`/exam/${encodeURIComponent(examId)}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  const data = await readJsonSafe<any>(res);
  return { res, data };
};

export const fetchDailyQuizFromApi = async (): Promise<{
  dayKey: string;
  refreshAt: number;
  questions: Question[];
}> => {
  const res = await apiFetch('/quiz/daily');
  if (!res.ok) {
    throw new Error('Failed to fetch daily quiz');
  }

  const data = (await res.json()) as any;
  const dayKey = String(data?.dayKey ?? '');
  const refreshAt = Number(data?.refreshAt ?? 0);
  const questionsRaw = Array.isArray(data?.questions) ? data.questions : [];

  if (!dayKey || !Number.isFinite(refreshAt) || refreshAt <= 0) {
    throw new Error('Invalid daily quiz payload');
  }

  return {
    dayKey,
    refreshAt,
    questions: questionsRaw.map(mapQuestionFromApi),
  };
};

export const fetchDailyDrillsFromApi = async (
  categoryParam?: 'TIU' | 'TWK' | 'TKP'
): Promise<{
  dayKey: string;
  refreshAt: number;
  category: 'TIU' | 'TWK' | 'TKP';
  questions: Question[];
}> => {
  const params = new URLSearchParams();
  if (categoryParam) params.set('category', categoryParam);
  const qs = params.toString();

  const res = await apiFetch(`/drills/daily${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    throw new Error('Failed to fetch daily drills');
  }

  const data = (await res.json()) as any;
  const dayKey = String(data?.dayKey ?? '');
  const refreshAt = Number(data?.refreshAt ?? 0);
  const categoryRaw = String(data?.category ?? '');
  const questionsRaw = Array.isArray(data?.questions) ? data.questions : [];
  const category = categoryRaw === 'TWK' || categoryRaw === 'TIU' || categoryRaw === 'TKP' ? categoryRaw : 'TIU';

  if (!dayKey || !Number.isFinite(refreshAt) || refreshAt <= 0) {
    throw new Error('Invalid daily drills payload');
  }

  return {
    dayKey,
    refreshAt,
    category,
    questions: questionsRaw.map(mapQuestionFromApi),
  };
};

export const createSession = (): UserSession => {
  const questions = getRandomQuestions(5);
  const session: UserSession = {
    id: crypto.randomUUID(),
    questionIds: questions.map(q => q.id),
    answers: {},
    score: 0,
    readiness: 0
  };
  saveSession(session);
  return session;
};

export const createDailyDrillSessionFromApi = async (): Promise<UserSession> => {
  const { dayKey, refreshAt, category, questions } = await fetchDailyDrillsFromApi();
  if (!questions.length) {
    throw new Error('Empty daily drills set');
  }

  const session: UserSession = {
    id: crypto.randomUUID(),
    dayKey,
    refreshAt,
    drillCategory: category,
    questionIds: questions.map((q) => q.id),
    questions,
    answers: {},
    score: 0,
    readiness: 0
  };
  saveDrillSession(session);
  return session;
};

// TEAM_018: allow starting today's drill session for a specific category (premium drill picker)
export const createDailyDrillSessionFromApiByCategory = async (
  category: 'TIU' | 'TWK' | 'TKP'
): Promise<UserSession> => {
  const { dayKey, refreshAt, category: actualCategory, questions } = await fetchDailyDrillsFromApi(category);
  if (!questions.length) {
    throw new Error('Empty daily drills set');
  }

  const session: UserSession = {
    id: crypto.randomUUID(),
    dayKey,
    refreshAt,
    drillCategory: actualCategory,
    questionIds: questions.map((q) => q.id),
    questions,
    answers: {},
    score: 0,
    readiness: 0
  };
  saveDrillSession(session);
  return session;
};

export const createDailySessionFromApi = async (): Promise<UserSession> => {
  const { dayKey, refreshAt, questions } = await fetchDailyQuizFromApi();
  if (!questions.length) {
    throw new Error('Empty question set');
  }

  const session: UserSession = {
    id: crypto.randomUUID(),
    dayKey,
    refreshAt,
    questionIds: questions.map((q) => q.id),
    questions,
    answers: {},
    score: 0,
    readiness: 0
  };
  saveSession(session);
  return session;
};

export const createSessionFromApi = async (
  count: number = 5,
  category?: 'TIU' | 'TWK' | 'TKP'
): Promise<UserSession> => {
  const questions = await fetchRandomQuestionsFromApi(count, category);
  if (!questions.length) {
    throw new Error('Empty question set');
  }

  const session: UserSession = {
    id: crypto.randomUUID(),
    questionIds: questions.map((q) => q.id),
    questions,
    answers: {},
    score: 0,
    readiness: 0
  };
  saveSession(session);
  return session;
};

export const saveSession = (session: UserSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const saveDrillSession = (session: UserSession) => {
  localStorage.setItem(DRILLS_SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): UserSession | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as UserSession;
    if (parsed.refreshAt && Number.isFinite(parsed.refreshAt) && Date.now() >= parsed.refreshAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    if (!parsed || !Array.isArray((parsed as any).questions) || !(parsed as any).questions.length) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

export const loadDrillSession = (): UserSession | null => {
  const data = localStorage.getItem(DRILLS_SESSION_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as UserSession;
    if (parsed.refreshAt && Number.isFinite(parsed.refreshAt) && Date.now() >= parsed.refreshAt) {
      localStorage.removeItem(DRILLS_SESSION_KEY);
      return null;
    }
    if (!parsed || !Array.isArray((parsed as any).questions) || !(parsed as any).questions.length) {
      localStorage.removeItem(DRILLS_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const clearDrillSession = () => {
  localStorage.removeItem(DRILLS_SESSION_KEY);
};

export const calculateResults = (
  session: UserSession,
  options?: { persistHistory?: boolean }
): UserSession => {
  const questions = getQuestionsForSession(session);
  let correctCount = 0;
  let weightedScore = 0;

  questions.forEach(q => {
    if (session.answers[q.id] === q.correct_option_id) {
      correctCount++;
      // Difficulty weighting: 1 + (difficulty - 3) * 0.15
      const weight = 1 + (q.difficulty - 3) * 0.15;
      weightedScore += (100 / questions.length) * weight;
    }
  });

  // Cap at 100
  const readiness = Math.min(Math.round(weightedScore), 100);

  const completedSession = {
    ...session,
    score: correctCount,
    readiness,
    completedAt: Date.now()
  };

  const shouldPersistHistory = options?.persistHistory !== false;
  if (shouldPersistHistory) {
    // Save to history
    const history = getHistory();
    history.unshift(completedSession);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10))); // Keep last 10
  }

  return completedSession;
};

export const getHistory = (): UserSession[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};
