// TEAM_033: client-side estimated tryout score calculator for Outcome-Driven Loop
// Calculates estimated score from available user data without backend aggregation

import { UserSession } from '../types';

// CPNS passing thresholds (from TEAM_013)
const PASSING_THRESHOLD = 300; // Total score needed to pass
const PASSING_TWK = 65;        // 13 correct answers (out of 35)
const PASSING_TIU = 80;        // 16 correct answers (out of 35)
const PASSING_TKP = 166;       // Minimum TKP score (out of 215, 5 questions)

// Max possible scores per section (for estimation)
const MAX_TWK = 150;   // 35 questions, weighted
const MAX_TIU = 150;   // 35 questions, weighted
const MAX_TKP = 215;   // 5 questions, weighted scoring

export interface SectionProgress {
  current: number;  // Estimated correct count or score
  needed: number;   // Passing threshold
  gap: number;      // Positive = still needed, negative = already passing
}

export interface ProgressEstimate {
  estimatedTotal: number;     // 0-500 scale estimated tryout score
  deltaToPassing: number;     // Gap to 300 (positive = need more, negative = exceeding)
  sessionsToTarget: number;   // Estimated sessions needed (≈ 2-3)
  perSection: {
    twk: SectionProgress;
    tiu: SectionProgress;
    tkp: SectionProgress;
  };
  weakestTopic: {
    name: string;
    accuracy: number;  // 0-100
  } | null;
}

// TEAM_033: Calculate estimated tryout score from available user data
export function calculateProgressEstimate(
  tryoutHistory: Array<{ twk: number; tiu: number; tkp: number; total: number }>,
  dailyQuizHistory: UserSession[],
  drillHistory: Array<{ category: 'TIU' | 'TWK' | 'TKP'; score: number; totalQuestions: number }>
): ProgressEstimate {
  // Start with baseline estimates
  let estimatedTwk = 0;
  let estimatedTiu = 0;
  let estimatedTkp = 0;

  // 1. Tryout history (most reliable) - weighted average of recent attempts
  if (tryoutHistory.length > 0) {
    const recent = tryoutHistory.slice(0, 3); // Last 3 tryouts
    const avgTwk = recent.reduce((sum, t) => sum + t.twk, 0) / recent.length;
    const avgTiu = recent.reduce((sum, t) => sum + t.tiu, 0) / recent.length;
    const avgTkp = recent.reduce((sum, t) => sum + t.tkp, 0) / recent.length;

    estimatedTwk = avgTwk;
    estimatedTiu = avgTiu;
    estimatedTkp = avgTkp;
  }

  // 2. Daily quiz history - map readiness to estimated scores
  // Readiness 0-100 maps to approximately 0-500 total score
  if (dailyQuizHistory.length > 0) {
    const recentQuiz = dailyQuizHistory.slice(0, 5);
    const avgReadiness = recentQuiz.reduce((sum, s) => sum + (s.readiness || 0), 0) / recentQuiz.length;

    // Map readiness 0-100 to estimated total 0-500
    const quizEstimatedTotal = (avgReadiness / 100) * 500;

    // If no tryout history, use daily quiz as primary estimate
    if (tryoutHistory.length === 0) {
      // Distribute proportionally based on typical CPNS distribution
      estimatedTwk = quizEstimatedTotal * 0.3;  // ~30% TWK
      estimatedTiu = quizEstimatedTotal * 0.3;  // ~30% TIU
      estimatedTkp = quizEstimatedTotal * 0.4;  // ~40% TKP (weighted differently)
    } else {
      // Blend with tryout history (30% quiz, 70% tryout)
      estimatedTwk = estimatedTwk * 0.7 + (quizEstimatedTotal * 0.3) * 0.3;
      estimatedTiu = estimatedTiu * 0.7 + (quizEstimatedTotal * 0.3) * 0.3;
      estimatedTkp = estimatedTkp * 0.7 + (quizEstimatedTotal * 0.4) * 0.4;
    }
  }

  // 3. Drill history - per-category accuracy
  const drillByCategory: Record<string, Array<{ score: number; total: number }>> = {
    TWK: [],
    TIU: [],
    TKP: [],
  };

  for (const drill of drillHistory) {
    const key = drill.category;
    if (drillByCategory[key]) {
      drillByCategory[key].push({ score: drill.score, total: drill.totalQuestions });
    }
  }

  // Calculate drill accuracy per category
  const calculateDrillAccuracy = (drills: Array<{ score: number; total: number }>): number => {
    if (drills.length === 0) return 0;
    const totalScore = drills.reduce((sum, d) => sum + d.score, 0);
    const totalQuestions = drills.reduce((sum, d) => sum + d.total, 0);
    return totalQuestions > 0 ? (totalScore / totalQuestions) : 0;
  };

  const twkAccuracy = calculateDrillAccuracy(drillByCategory.TWK);
  const tiuAccuracy = calculateDrillAccuracy(drillByCategory.TIU);
  const tkpAccuracy = calculateDrillAccuracy(drillByCategory.TKP);

  // If we have drill data but no tryout history, use drill accuracy
  if (tryoutHistory.length === 0 && dailyQuizHistory.length === 0) {
    // TWK: 35 questions, estimate correct count
    estimatedTwk = Math.round(twkAccuracy * 35); // Correct count (will be scaled to score)
    estimatedTiu = Math.round(tiuAccuracy * 35);
    estimatedTkp = Math.round(tkpAccuracy * 5);

    // Convert correct counts to estimated scores (rough approximation)
    estimatedTwk = (estimatedTwk / 35) * 100; // Percentage of max
    estimatedTiu = (estimatedTiu / 35) * 100;
    estimatedTkp = (estimatedTkp / 5) * 215;
  } else if (tryoutHistory.length === 0) {
    // Blend with daily quiz (50/50)
    estimatedTwk = estimatedTwk * 0.5 + ((twkAccuracy * 35) / 35 * 100) * 0.5;
    estimatedTiu = estimatedTiu * 0.5 + ((tiuAccuracy * 35) / 35 * 100) * 0.5;
    estimatedTkp = estimatedTkp * 0.5 + ((tkpAccuracy * 5) / 5 * 215) * 0.5;
  }

  // Calculate total and gaps
  const estimatedTotal = Math.round(estimatedTwk + estimatedTiu + estimatedTkp);
  const deltaToPassing = Math.max(0, PASSING_THRESHOLD - estimatedTotal);

  // Estimate sessions needed (assume +10-15 points per focused session)
  const pointsPerSession = 12; // Average improvement per drill/tryout
  const sessionsToTarget = deltaToPassing > 0 ? Math.ceil(deltaToPassing / pointsPerSession) : 0;

  // Find weakest topic for targeting
  const accuracies = [
    { name: 'TWK (Kebangsaan)', accuracy: Math.round(twkAccuracy * 100) },
    { name: 'TIU (Intelegensia)', accuracy: Math.round(tiuAccuracy * 100) },
    { name: 'TKP (Pribadi)', accuracy: Math.round(tkpAccuracy * 100) },
  ];
  const weakest = accuracies.reduce((min, curr) => curr.accuracy < min.accuracy ? curr : min, accuracies[0]);

  // Convert TWK/TIU estimates from scores to "correct answers" for display
  // (13/35 for TWK, 16/35 for TIU)
  const twkCorrect = Math.round((estimatedTwk / 100) * 35);
  const tiuCorrect = Math.round((estimatedTiu / 100) * 35);
  const tkpScore = Math.round(estimatedTkp);

  return {
    estimatedTotal,
    deltaToPassing,
    sessionsToTarget,
    perSection: {
      twk: {
        current: twkCorrect,
        needed: 13,
        gap: Math.max(0, 13 - twkCorrect),
      },
      tiu: {
        current: tiuCorrect,
        needed: 16,
        gap: Math.max(0, 16 - tiuCorrect),
      },
      tkp: {
        current: tkpScore,
        needed: PASSING_TKP,
        gap: Math.max(0, PASSING_TKP - tkpScore),
      },
    },
    weakestTopic: accuracies.some(a => a.accuracy > 0)
      ? { name: weakest.name, accuracy: weakest.accuracy }
      : null,
  };
}

// TEAM_033: Get sessions estimate text
export function getSessionsEstimateText(sessions: number): string {
  if (sessions <= 0) return 'Target tercapai!';
  if (sessions === 1) return '≈ 1 sesi lagi';
  if (sessions <= 3) return `≈ ${sessions} sesi lagi`;
  return `≈ ${sessions} sesi lagi`;
}

// TEAM_033: Format delta for display
export function formatDelta(delta: number): string {
  if (delta <= 0) return 'Sudah melebihi passing grade!';
  return `Kurang ${delta} poin lagi`;
}
