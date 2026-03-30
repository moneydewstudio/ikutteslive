export interface DailyQuizShareData {
  kind: 'daily_quiz';
  userName: string;
  percentage: number;
  correct: number;
  total: number;
  readiness: string;
  generatedAt: string;
  link: string;
}

export interface TryoutShareData {
  kind: 'tryout';
  userName: string;
  totalScore: number;
  twkScore: number;
  tiuScore: number;
  tkpScore: number;
  passed: boolean;
  correct: number;
  total: number;
  generatedAt: string;
  link: string;
}

export type SharePayload = DailyQuizShareData | TryoutShareData;
