// TEAM_033: Delta Banner - Core trigger for Outcome-Driven Loop
// Shows: estimated score, gap to passing, and sessions needed

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { ProgressEstimate, calculateProgressEstimate, formatDelta, getSessionsEstimateText } from '../services/progressEstimator';
import { UserSession } from '../types';
import * as QuizService from '../services/quizService';

interface DeltaBannerProps {
  onContinueClick: () => void;
  continueLabel?: string;
  tryoutHistory?: Array<{ twk: number; tiu: number; tkp: number; total: number }>;
  drillHistory?: Array<{ category: 'TIU' | 'TWK' | 'TKP'; score: number; totalQuestions: number }>;
  compact?: boolean; // For smaller displays
}

const DeltaBanner: React.FC<DeltaBannerProps> = ({
  onContinueClick,
  continueLabel = 'Lanjutkan Latihan',
  tryoutHistory = [],
  drillHistory,
  compact = false,
}) => {
  const [estimate, setEstimate] = useState<ProgressEstimate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEstimate = useCallback(() => {
    setIsLoading(true);

    // Load daily quiz history
    const dailyQuizHistory = QuizService.getHistory();

    // Build drill history from localStorage if not provided
    let drills = drillHistory;
    if (!drills) {
      drills = [];
      const categories: Array<'TIU' | 'TWK' | 'TKP'> = ['TIU', 'TWK', 'TKP'];
      for (const cat of categories) {
        const session = QuizService.loadDrillSession(cat);
        if (session?.completedAt && session.score !== undefined) {
          drills.push({
            category: cat,
            score: session.score,
            totalQuestions: session.questionIds.length,
          });
        }
      }
    }

    const est = calculateProgressEstimate(tryoutHistory, dailyQuizHistory, drills);
    setEstimate(est);
    setIsLoading(false);
  }, [tryoutHistory, drillHistory]);

  useEffect(() => {
    loadEstimate();
  }, [loadEstimate]);

  if (isLoading) {
    return (
      <div className="bg-brand-cream border border-black p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!estimate) return null;

  const isPassing = estimate.deltaToPassing <= 0;
  const progressPercent = Math.min(100, (estimate.estimatedTotal / 300) * 100);

  if (compact) {
    return (
      <div className="bg-brand-cream border border-black p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">Skor estimasi: {estimate.estimatedTotal}</div>
            <div className="text-xs text-gray-600">
              {isPassing ? 'Sudah melebihi passing grade!' : formatDelta(estimate.deltaToPassing)}
            </div>
          </div>
          <button
            onClick={onContinueClick}
            className="flex items-center gap-1 text-sm font-bold bg-black text-white px-3 py-1.5 hover:bg-gray-800 transition-colors"
          >
            {continueLabel} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream border border-black overflow-hidden">
      {/* Main row */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Score and Delta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5" />
              <span className="font-bold text-lg">Skor estimasi: {estimate.estimatedTotal}</span>
            </div>
            <div className="text-base font-medium">
              {isPassing ? (
                <span className="text-green-700">Sudah melebihi passing grade! 🎉</span>
              ) : (
                <span className="text-brand-orange">{formatDelta(estimate.deltaToPassing)}</span>
              )}
            </div>
            {!isPassing && (
              <div className="text-sm text-gray-600 mt-1">
                {getSessionsEstimateText(estimate.sessionsToTarget)}
              </div>
            )}
          </div>

          {/* Right: CTA */}
          <button
            onClick={onContinueClick}
            className="flex items-center justify-center gap-2 bg-black text-white font-bold px-6 py-3 hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none"
          >
            {continueLabel}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-lime transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-bold">300 (passing)</span>
            <span>500</span>
          </div>
        </div>
      </div>

      {/* Expandable details */}
      <div className="border-t border-black/10">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-1 py-2 text-sm font-bold text-gray-600 hover:bg-black/5 transition-colors"
        >
          {showDetails ? (
            <>Sembunyikan detail <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Lihat detail per bagian <ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        {showDetails && (
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* TWK */}
              <div className="bg-white border border-black p-3">
                <div className="font-bold text-sm mb-1">TWK (Kebangsaan)</div>
                <div className="text-2xl font-black">
                  {estimate.perSection.twk.current}<span className="text-sm font-normal text-gray-500">/13 benar</span>
                </div>
                {estimate.perSection.twk.gap > 0 && (
                  <div className="text-xs text-brand-orange font-medium mt-1">
                    Butuh {estimate.perSection.twk.gap} lagi
                  </div>
                )}
              </div>

              {/* TIU */}
              <div className="bg-white border border-black p-3">
                <div className="font-bold text-sm mb-1">TIU (Intelegensia)</div>
                <div className="text-2xl font-black">
                  {estimate.perSection.tiu.current}<span className="text-sm font-normal text-gray-500">/16 benar</span>
                </div>
                {estimate.perSection.tiu.gap > 0 && (
                  <div className="text-xs text-brand-orange font-medium mt-1">
                    Butuh {estimate.perSection.tiu.gap} lagi
                  </div>
                )}
              </div>

              {/* TKP */}
              <div className="bg-white border border-black p-3">
                <div className="font-bold text-sm mb-1">TKP (Pribadi)</div>
                <div className="text-2xl font-black">
                  {estimate.perSection.tkp.current}<span className="text-sm font-normal text-gray-500">/166 minimum</span>
                </div>
                {estimate.perSection.tkp.gap > 0 && (
                  <div className="text-xs text-brand-orange font-medium mt-1">
                    Butuh {estimate.perSection.tkp.gap} lagi
                  </div>
                )}
              </div>
            </div>

            {estimate.weakestTopic && estimate.weakestTopic.accuracy < 70 && (
              <div className="mt-3 p-3 bg-brand-pink/30 border border-brand-pink rounded">
                <div className="text-sm font-bold">
                  Kelemahan utama: {estimate.weakestTopic.name.split(' ')[0]} (akurasi {estimate.weakestTopic.accuracy}%)
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeltaBanner;
