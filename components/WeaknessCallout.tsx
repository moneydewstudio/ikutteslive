// TEAM_033: Weakness Callout - Directional trigger for Outcome-Driven Loop
// Shows after activity completion to direct users to their weakest topic

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface WeaknessData {
  topic: 'TWK' | 'TIU' | 'TKP';
  subtopic: string;
  accuracy: number; // 0-100
  gapToPassing: number;
}

interface WeaknessCalloutProps {
  weakness: WeaknessData | null;
  onPracticeClick: () => void;
  showPremiumCta?: boolean;
  onPremiumClick?: () => void;
}

const getTopicLabel = (topic: string): string => {
  const labels: Record<string, string> = {
    TWK: 'TWK (Kebangsaan)',
    TIU: 'TIU (Intelegensia)',
    TKP: 'TKP (Pribadi)',
  };
  return labels[topic] || topic;
};

const getSubtopicLabel = (subtopic: string): string => {
  // Map subtopic codes to readable names
  const labels: Record<string, string> = {
    'Verbal': 'Analogi Verbal',
    'Numerik': 'Aritmatika & Logika Numerik',
    'Figural': 'Analogi Figural',
    'Logika': 'Penalaran Logis',
    'Pancasila': 'Pancasila',
    'UUD 1945': 'UUD 1945 & NKRI',
    'NKRI': 'Bentuk Negara NKRI',
    'Bhinneka Tunggal Ika': 'Bhinneka Tunggal Ika',
    'Nasionalisme': 'Nasionalisme & Bela Negara',
    'Pelayanan Publik': 'Pelayanan Publik',
    'Jejaring Kerja': 'Jejaring Kerja & Kolaborasi',
    'Sosial Budaya': 'Sosial Budaya',
    'Profesionalisme': 'Profesionalisme',
    'Anti Radikalisme': 'Anti Radikalisme',
  };
  return labels[subtopic] || subtopic;
};

const WeaknessCallout: React.FC<WeaknessCalloutProps> = ({
  weakness,
  onPracticeClick,
  showPremiumCta = false,
  onPremiumClick,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!weakness || isDismissed) return null;

  const isCritical = weakness.accuracy < 50;
  const isWeak = weakness.accuracy < 70;

  return (
    <div className={`border-l-4 p-lg mb-lg ${isCritical ? 'bg-red-50 border-red-500' : 'bg-brand-pink/30 border-brand-orange'}`}>
      <div className="flex items-start gap-md">
        <div className={`mt-0.5 ${isCritical ? 'text-red-500' : 'text-brand-orange'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm mb-1">
            {isCritical ? '⚠️ Kelemahan Kritis Terdeteksi' : '📊 Area Perlu Peningkatan'}
          </div>
          <div className="text-sm mb-2">
            <span className="font-medium">{getTopicLabel(weakness.topic)}</span>
            <span className="text-gray-500"> • </span>
            <span>{getSubtopicLabel(weakness.subtopic)}</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-brand-orange'}`}
                  style={{ width: `${weakness.accuracy}%` }}
                />
              </div>
            </div>
            <span className={`text-sm font-bold ${isCritical ? 'text-red-600' : 'text-brand-orange'}`}>
              {weakness.accuracy}%
            </span>
          </div>

          {isCritical && (
            <p className="text-xs text-red-700 mb-3">
              Akurasi di bawah 50% — perlu latihan intensif untuk mencapai passing grade.
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={onPracticeClick}
              className="flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-2 hover:bg-gray-800 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Latihan {weakness.topic}
              <ArrowRight className="w-3 h-3" />
            </button>

            {showPremiumCta && onPremiumClick && (
              <button
                onClick={onPremiumClick}
                className="text-xs font-bold border border-black px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                Buka Latihan Lanjutan
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// TEAM_033: Hook to calculate weakness from local drill history
export function useWeaknessFromHistory(): WeaknessData | null {
  const [weakness, setWeakness] = useState<WeaknessData | null>(null);

  useEffect(() => {
    // Calculate weakness from localStorage drill history
    const calculateWeakness = () => {
      const categories: Array<'TWK' | 'TIU' | 'TKP'> = ['TWK', 'TIU', 'TKP'];
      const categoryStats: Record<string, { correct: number; total: number }> = {
        TWK: { correct: 0, total: 0 },
        TIU: { correct: 0, total: 0 },
        TKP: { correct: 0, total: 0 },
      };

      for (const cat of categories) {
        const key = `ikuttes_drills_session_v1_${cat}`;
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const session = JSON.parse(data);
            if (session?.completedAt && typeof session.score === 'number') {
              categoryStats[cat].correct += session.score;
              categoryStats[cat].total += session.questionIds?.length || 20;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      // Find weakest category
      let weakestCategory: string | null = null;
      let lowestAccuracy = 100;

      for (const [cat, stats] of Object.entries(categoryStats)) {
        if (stats.total > 0) {
          const accuracy = (stats.correct / stats.total) * 100;
          if (accuracy < lowestAccuracy) {
            lowestAccuracy = accuracy;
            weakestCategory = cat;
          }
        }
      }

      if (!weakestCategory || lowestAccuracy >= 80) {
        return null;
      }

      // Map to a representative subtopic
      const subtopicMap: Record<string, string> = {
        TWK: 'Pancasila',
        TIU: 'Logika',
        TKP: 'Pelayanan Publik',
      };

      return {
        topic: weakestCategory as 'TWK' | 'TIU' | 'TKP',
        subtopic: subtopicMap[weakestCategory],
        accuracy: Math.round(lowestAccuracy),
        gapToPassing: Math.max(0, 70 - Math.round(lowestAccuracy)), // Assume 70% is passing
      };
    };

    setWeakness(calculateWeakness());
  }, []);

  return weakness;
}

export default WeaknessCallout;
