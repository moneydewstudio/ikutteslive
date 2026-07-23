import { Question, UserSession } from '../types';
import { QUESTIONS_POOL } from '../constants';
import { apiFetch } from './apiClient';

// TEAM_001: make practice sessions use API-fetched questions (Neon via Worker) and store a session snapshot

// TEAM_004: support daily quiz sessions that rotate at Jakarta midnight via server-provided dayKey/refreshAt
// TEAM_005: daily drills helpers and storage (global, single-category rotation)

const SESSION_KEY = 'ikuttes_session_v1';
const DRILLS_SESSION_KEY_PREFIX = 'ikuttes_drills_session_v1_';
const HISTORY_KEY = 'ikuttes_history_v1';

const getDrillSessionKey = (category: 'TIU' | 'TWK' | 'TKP'): string => {
  return `${DRILLS_SESSION_KEY_PREFIX}${category}`;
};

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


// TEAM_037: per-theme drill � fetch from GET /drills/by-theme and build a session keyed by theme

// TEAM_037: list drill themes for a category to render the per-theme drill picker
export const fetchThemesFromApi = async (
  categoryParam: 'TIU' | 'TWK' | 'TKP'
): Promise<Array<{ themeId: number; themeName: string; themeCode: string; subtopicName: string; questionCount: number }>> => {
  const params = new URLSearchParams();
  params.set('category', categoryParam);
  const res = await apiFetch(`/themes?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch themes');
  }
  const data = (await res.json()) as any;
  const themes = Array.isArray(data?.themes) ? data.themes : [];
  return themes.map((t: any) => ({
    themeId: Number(t.themeId),
    themeName: String(t.themeName ?? ''),
    themeCode: String(t.themeCode ?? ''),
    subtopicName: String(t.subtopicName ?? ''),
    questionCount: Number(t.questionCount ?? 0),
  }));
};
export const fetchDrillsByThemeFromApi = async (
  categoryParam: 'TIU' | 'TWK' | 'TKP',
  themeId: number
): Promise<{
  dayKey: string;
  refreshAt: number;
  category: 'TIU' | 'TWK' | 'TKP';
  themeId: number;
  questions: Question[];
}> => {
  const params = new URLSearchParams();
  params.set('category', categoryParam);
  params.set('themeId', String(themeId));
  const res = await apiFetch(`/drills/by-theme?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch theme drills');
  }
  const data = (await res.json()) as any;
  const dayKey = String(data?.dayKey ?? '');
  const refreshAt = Number(data?.refreshAt ?? 0);
  const categoryRaw = String(data?.category ?? '');
  const questionsRaw = Array.isArray(data?.questions) ? data.questions : [];
  const category = categoryRaw === 'TWK' || categoryRaw === 'TIU' || categoryRaw === 'TKP' ? categoryRaw : 'TIU';
  if (!dayKey || !Number.isFinite(refreshAt) || refreshAt <= 0) {
    throw new Error('Invalid theme drills payload');
  }
  return {
    dayKey,
    refreshAt,
    category,
    themeId: Number(data?.themeId ?? themeId),
    questions: questionsRaw.map(mapQuestionFromApi),
  };
};

export const createDailyDrillSessionFromApiByTheme = async (
  category: 'TIU' | 'TWK' | 'TKP',
  themeId: number
): Promise<UserSession> => {
  const { dayKey, refreshAt, category: actualCategory, themeId: actualThemeId, questions } =
    await fetchDrillsByThemeFromApi(category, themeId);
  if (!questions.length) {
    throw new Error('Empty theme drills set');
  }
  const session: UserSession = {
    id: crypto.randomUUID(),
    dayKey,
    refreshAt,
    drillCategory: actualCategory,
    drillThemeId: actualThemeId,
    questionIds: questions.map((q) => q.id),
    questions,
    answers: {},
    score: 0,
    readiness: 0,
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
  if (!session.drillCategory) {
    throw new Error('Drill session must have a drillCategory');
  }
  const key = getDrillSessionKey(session.drillCategory);
  localStorage.setItem(key, JSON.stringify(session));
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

export const loadDrillSession = (category: 'TIU' | 'TWK' | 'TKP'): UserSession | null => {
  const key = getDrillSessionKey(category);
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as UserSession;
    // TEAM_019: legacy drills sessions were 10 questions; discard so we refetch the 20-question daily set
    if (Array.isArray(parsed?.questionIds) && parsed.questionIds.length === 10) {
      localStorage.removeItem(key);
      return null;
    }
    if (parsed.refreshAt && Number.isFinite(parsed.refreshAt) && Date.now() >= parsed.refreshAt) {
      localStorage.removeItem(key);
      return null;
    }
    if (!parsed || !Array.isArray((parsed as any).questions) || !(parsed as any).questions.length) {
      localStorage.removeItem(key);
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

export const clearDrillSession = (category: 'TIU' | 'TWK' | 'TKP') => {
  const key = getDrillSessionKey(category);
  localStorage.removeItem(key);
};

export const clearAllDrillSessions = () => {
  const categories: Array<'TIU' | 'TWK' | 'TKP'> = ['TIU', 'TWK', 'TKP'];
  categories.forEach(category => {
    const key = getDrillSessionKey(category);
    localStorage.removeItem(key);
  });
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

// TEAM_018: migrate old drill session key to per-category keys (one-time migration)
export const migrateOldDrillSession = () => {
  const OLD_KEY = 'ikuttes_drills_session_v1';
  const data = localStorage.getItem(OLD_KEY);
  if (!data) return;
  
  try {
    const session = JSON.parse(data) as UserSession;
    if (session.drillCategory && ['TIU', 'TWK', 'TKP'].includes(session.drillCategory)) {
      const newKey = getDrillSessionKey(session.drillCategory);
      localStorage.setItem(newKey, data);
    }
  } catch (e) {
    console.warn('Failed to migrate old drill session', e);
  } finally {
    localStorage.removeItem(OLD_KEY);
  }
};

