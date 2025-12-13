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

export interface UserSession {
  id: string;
  answers: Record<string, string>; // question_id -> selected_option_id
  questionIds: string[];
  score: number;
  readiness: number;
  percentile: number;
  completedAt?: number;
}

export type ViewState = 'QUIZ' | 'RESULTS' | 'BONUS' | 'TRYOUT' | 'PROFILE' | 'SIGNUP';

export interface User {
  id: string;
  email?: string;
  isPro: boolean;
  name?: string;
  streak: number;
}