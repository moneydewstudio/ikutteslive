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
  score: number;
  readiness: number;
  percentile: number;
  completedAt?: number;
}

export type ViewState = 'QUIZ' | 'RESULTS' | 'BONUS' | 'TRYOUT' | 'PROFILE' | 'SIGNUP' | 'AD_INTERSTITIAL';

export interface User {
  id: string; // Firebase UID
  email?: string;
  isPro: boolean;
  name?: string;
  streak: number;
  premiumUntil?: number;
}
