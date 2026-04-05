export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5;

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: 'TIU' | 'TWK' | 'TKP';
  difficulty: QuestionDifficulty;
  text: string;
  options: Option[];
  correct_option_id: string;
  explanation: string;
  image_url?: string;
}

// TEAM_001: store question snapshots in sessions so Latihan can be DB-backed without refetching

export interface UserSession {
  id: string;
  answers: Record<string, string>; // question_id -> selected_option_id
  questionIds: string[];
  questions?: Question[];
  // TEAM_004: persist daily-quiz metadata so sessions can be invalidated at Jakarta midnight
  dayKey?: string;
  refreshAt?: number;
  // TEAM_005: store daily drill category for single-category rotation sessions
  drillCategory?: 'TIU' | 'TWK' | 'TKP';
  score: number;
  readiness: number;
  completedAt?: number;
}

export type ViewState = 'QUIZ' | 'RESULTS' | 'BONUS' | 'TRYOUT' | 'PROFILE' | 'DRILLS' | 'SIGNUP' | 'AD_INTERSTITIAL' | 'ADMIN_PAYMENTS';

export interface User {
  id: string; // Firebase UID
  email?: string;
  isPro: boolean;
  name?: string;
  streak: number;
  premiumUntil?: number;
}
