// TEAM_033 + TEAM_032: Delta Banner - Visual-first performance dashboard
// Shows: instant status comprehension without mental math

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProgressEstimate, calculateProgressEstimate, getSessionsEstimateText } from '../services/progressEstimator';
import { UserSession } from '../types';
import * as QuizService from '../services/quizService';

// TEAM_032: Status determination for visual feedback
type StatusType = 'critical' | 'warning' | 'approaching' | 'passing';

const getStatusFromScore = (score: number): StatusType => {
  if (score >= 300) return 'passing';
  if (score >= 275) return 'approaching';
  if (score >= 220) return 'warning';
  return 'critical';
};

const StatusConfig: Record<StatusType, { label: string; color: string; bgColor: string; icon: React.ReactNode; pulse?: boolean }> = {
  critical: { 
    label: 'Perlu Belajar Intensif', 
    color: 'text-white', 
    bgColor: 'bg-red-600',
    icon: <AlertCircle className="w-4 h-4" />
  },
  warning: { 
    label: 'Menuju Passing Grade', 
    color: 'text-black', 
    bgColor: 'bg-brand-orange',
    icon: <TrendingUp className="w-4 h-4" />
  },
  approaching: { 
    label: 'Hampir Lolos!', 
    color: 'text-black', 
    bgColor: 'bg-brand-lime',
    icon: <TrendingUp className="w-4 h-4" />,
    pulse: true
  },
  passing: { 
    label: 'Siap Lolos!', 
    color: 'text-black', 
    bgColor: 'bg-green-500',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
};

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
      <div className="bg-brand-cream border border-black p-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-sm"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!estimate) return null;

  const isPassing = estimate.deltaToPassing <= 0;
  const progressPercent = Math.min(100, (estimate.estimatedTotal / 300) * 100);

  if (compact) {
    const status = getStatusFromScore(estimate.estimatedTotal);
    const config = StatusConfig[status];
    const compactProgressPercent = Math.min(100, (estimate.estimatedTotal / 500) * 100);
    const passingPercent = (300 / 500) * 100; // 60%
    
    return (
      <div className="p-lg">
        <div className="flex items-center justify-between gap-lg">
          <div className="flex-1 min-w-0">
            {/* Explanatory label */}
            <div className="text-xs font-bold text-gray-500 mb-sm">Estimasi Nilai SKD Kamu</div>
            
            {/* Status Badge + Score */}
            <div className="flex items-center gap-md mb-md">
              <span className={`inline-flex items-center gap-sm px-2 py-0.5 rounded text-xs font-black ${config.bgColor} ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
                {config.icon}
                {config.label}
              </span>
              <span className="font-black text-lg">{estimate.estimatedTotal}<span className="text-sm text-gray-500">/500</span></span>
            </div>
            
            {/* Visual Progress Bar with 300 marker */}
            <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-700 ease-out"
                style={{ width: `${compactProgressPercent}%` }}
              />
              {/* 300 passing marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-black"
                style={{ left: `${passingPercent}%` }}
              />
            </div>
            {/* Scale: 0 - 300 (Nilai Minimal Lolos SKD) - 500 */}
            <div className="flex justify-between text-[10px] text-gray-500 mt-xs font-medium">
              <span>0</span>
              <span className="font-bold text-black">300</span>
              <span>500</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded">Nilai Minimal Lolos SKD</span>
            </div>
          </div>
          
          <button
            onClick={onContinueClick}
            className="flex-shrink-0 flex items-center gap-sm text-sm font-bold bg-black text-white px-3 py-2 hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none"
          >
            {continueLabel} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusFromScore(estimate.estimatedTotal);
  const config = StatusConfig[status];
  const fullProgressPercent = Math.min(100, (estimate.estimatedTotal / 500) * 100);
  const passingPercent = (300 / 500) * 100; // 60%

  return (
    <div className="bg-brand-cream border border-black overflow-hidden">
      {/* Main row - Visual-first design */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Visual Status Dashboard */}
          <div className="flex-1">
            {/* Header */}
            <div className="text-sm font-bold text-gray-600 mb-2">Perkiraan Nilai SKD Kamu Nanti</div>
            
            {/* Status Badge - Instant comprehension */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm font-black ${config.bgColor} ${config.color} shadow-sm ${config.pulse ? 'animate-pulse' : ''}`}>
                {config.icon}
                {config.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-2xl tracking-tight">{estimate.estimatedTotal}</span>
                <span className="text-lg text-gray-500 font-bold">/500</span>
              </div>
            </div>
            
            {/* Visual Progress with Passing Marker */}
            <div className="relative">
              <div className="h-3 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                {/* Main progress */}
                <div 
                  className="h-full bg-gradient-to-r from-gray-700 to-black transition-all duration-1000 ease-out relative"
                  style={{ width: `${fullProgressPercent}%` }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              
              {/* Passing threshold marker - THE KEY VISUAL */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-black shadow-lg"
                style={{ left: `${passingPercent}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded">Nilai Minimal Lolos SKD</span>
                </div>
              </div>
            </div>
            
            {/* Practice encouragement */}
            <div className="mt-4 text-sm text-gray-600">
              Sering Berlatih Meningkatkan Skor Estimasi Kamu
            </div>
          </div>

          {/* Right: CTA */}
          <button
            onClick={onContinueClick}
            className="flex items-center justify-center gap-2 bg-black text-white font-bold px-6 py-3 hover:bg-gray-800 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none"
          >
            {continueLabel}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scale legend */}
        <div className="flex justify-between text-xs text-gray-500 mt-6 font-medium">
          <span>0</span>
          <span className="text-gray-400">100</span>
          <span className="text-gray-400">200</span>
          <span className="font-bold text-black">300</span>
          <span className="text-gray-400">400</span>
          <span>500</span>
        </div>
      </div>

      {/* TEAM_032: Per-section details hidden - user has spider chart in Dashboard */}
      {/* Expandable details removed - see Dashboard for detailed breakdown */}
    </div>
  );
};

export default DeltaBanner;
