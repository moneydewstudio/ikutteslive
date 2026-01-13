import { Question, UserSession } from '../types';
import { QUESTIONS_POOL } from '../constants';
import { apiFetch } from './apiClient';

const SESSION_KEY = 'ikuttes_session_v1';
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

  const allowedSubjects: Array<Question['subject']> = ['TIU', 'TWK', 'TKP'];

  return data.map((raw) => {
    const subjectRaw = raw.subject as string | null | undefined;
    const subject = allowedSubjects.includes(subjectRaw as any)
      ? (subjectRaw as Question['subject'])
      : 'TIU';

    let difficultyNum = Number(raw.difficulty ?? 3);
    if (!Number.isFinite(difficultyNum)) difficultyNum = 3;
    difficultyNum = Math.min(5, Math.max(1, difficultyNum));

    const options = Array.isArray(raw.options)
      ? raw.options.map((o: any) => ({
          id: String(o.id),
          text: String(o.text ?? ''),
        }))
      : [];

    const correctId =
      typeof raw.correct_option_id === 'string'
        ? raw.correct_option_id
        : (options[0]?.id ?? '');

    const question: Question = {
      id: String(raw.id),
      subject,
      difficulty: difficultyNum as any,
      text: String(raw.text ?? ''),
      options,
      correct_option_id: correctId,
      explanation: typeof raw.explanation === 'string' ? raw.explanation : '',
      image_url: raw.image_url ?? undefined,
    };

    return question;
  });
};

export const createSession = (): UserSession => {
  const questions = getRandomQuestions(5);
  const session: UserSession = {
    id: crypto.randomUUID(),
    questionIds: questions.map(q => q.id),
    answers: {},
    score: 0,
    readiness: 0,
    percentile: 0
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
    readiness: 0,
    percentile: 0,
  };
  saveSession(session);
  return session;
};

export const saveSession = (session: UserSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): UserSession | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as UserSession;
    if (!parsed || !Array.isArray((parsed as any).questions) || !(parsed as any).questions.length) {
      localStorage.removeItem(SESSION_KEY);
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

export const calculateResults = (session: UserSession): UserSession => {
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
  
  // Mock Percentile Calculation (randomized for demo feel, but sticky to score)
  const basePercentile = 40;
  const percentile = Math.min(99, Math.round(basePercentile + (readiness * 0.5) + (Math.random() * 10)));

  const completedSession = {
    ...session,
    score: correctCount,
    readiness,
    percentile,
    completedAt: Date.now()
  };

  // Save to history
  const history = getHistory();
  history.unshift(completedSession);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10))); // Keep last 10

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
