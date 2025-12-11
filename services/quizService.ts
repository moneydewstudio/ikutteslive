import { Question, UserSession } from '../types';
import { QUESTIONS_POOL } from '../constants';

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

export const saveSession = (session: UserSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): UserSession | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const calculateResults = (session: UserSession): UserSession => {
  const questions = getQuestionsByIds(session.questionIds);
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
