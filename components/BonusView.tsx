import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BonusCard, { Pack } from './BonusCard';
import DeltaBanner from './DeltaBanner';
import { User } from '../types';
import * as QuizService from '../services/quizService';
import OnboardingTour from '../src/components/OnboardingTour';
import { usePaywall } from '../src/contexts/PaywallContext';
import { apiFetch } from '../services/apiClient';

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

interface BonusViewProps {
  user: User | null;
  onStartDrill: (category: DrillCategory) => void;
}

type TryoutHistoryRow = {
  id: string;
  total: number;
  twk: number;
  tiu: number;
  tkp: number;
  passed: boolean | null;
  createdAt: string;
};

// TEAM_018: repurpose Bonus page into Drills entry (3 cards with free/premium gating)
const BonusView: React.FC<BonusViewProps> = ({ user, onStartDrill }) => {
  const { openPaywall } = usePaywall();
  const [todayCategory, setTodayCategory] = useState<DrillCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tryoutHistory, setTryoutHistory] = useState<TryoutHistoryRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const daily = await QuizService.fetchDailyDrillsFromApi();
        if (!cancelled) setTodayCategory(daily.category);
      } catch (e) {
        console.error('TEAM_018 failed to load daily drill category', e);
        if (!cancelled) setTodayCategory(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  // TEAM_034: Fetch tryoutHistory for consistent DeltaBanner score
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await apiFetch('/tryout/history');
        if (res.status === 403) return;
        if (!res.ok) throw new Error('Failed to load tryout history');
        const json = (await res.json()) as any;
        const rows = Array.isArray(json?.history) ? (json.history as TryoutHistoryRow[]) : [];
        if (!cancelled) setTryoutHistory(rows);
      } catch {
        // Silently fail - DeltaBanner will use local data
      }
    };
    void run();
    return () => { cancelled = true; };
  }, []);

  const isPremium = !!user?.isPro;

  const isUnlocked = useCallback(
    (category: DrillCategory) => {
      if (isPremium) return true;
      if (!todayCategory) return false;
      return category === todayCategory;
    },
    [isPremium, todayCategory]
  );

  const packs: Pack[] = useMemo(() => {
    const make = (id: number, category: DrillCategory, title: string, color: string): Pack => ({
      id,
      title,
      subject: category,
      questions: 20,
      difficulty: 'Harian',
      price: isUnlocked(category) ? 'Gratis' : 'Terkunci',
      color: isUnlocked(category) ? color : 'bg-white',
    });

    return [
      make(1, 'TIU', 'Drill TIU', 'bg-brand-pink'),
      make(2, 'TWK', 'Drill TWK', 'bg-brand-cream'),
      make(3, 'TKP', 'Drill TKP', 'bg-brand-lime'),
    ];
  }, [isUnlocked]);

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
      
      {/* Header - TEAM_032: Clearer explanation of what drills are */}
      <div className="p-2xl border-b border-black bg-brand-cream">
         <h1 className="text-5xl font-black uppercase tracking-tight mb-xl">Latihan Per Bagian</h1>
         <p className="text-lg max-w-xl">Fokus latihan TWK, TIU, atau TKP secara terpisah. Tiap drill = 20 soal. Gratis: 1 kategori terbuka per hari.</p>
      </div>

      {/* TEAM_033: Delta Banner - Progress towards passing grade */}
      <DeltaBanner
        onContinueClick={() => onStartDrill(todayCategory || 'TIU')}
        continueLabel={`Latihan ${todayCategory || 'Harian'} →`}
        tryoutHistory={tryoutHistory}
        compact
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-tour="drills-cards">
        
          {packs.map((pack) => (
              <BonusCard
                key={pack.id}
                pack={pack}
                onClick={() => {
                  const category = pack.subject as DrillCategory;
                  if (!isUnlocked(category)) {
                    openPaywall('drills_locked_card');
                    return;
                  }
                  onStartDrill(category);
                }}
              />
          ))}
      </div>
      
      {/* Onboarding Tour - only renders on first visit */}
      <OnboardingTour />
    </div>
  );
};

export default BonusView;