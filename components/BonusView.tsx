import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BonusCard, { Pack } from './BonusCard';
import { User } from '../types';
import * as QuizService from '../services/quizService';

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

interface BonusViewProps {
  user: User | null;
  onStartDrill: (category: DrillCategory) => void;
}

// TEAM_018: repurpose Bonus page into Drills entry (3 cards with free/premium gating)
const BonusView: React.FC<BonusViewProps> = ({ user, onStartDrill }) => {
  const [todayCategory, setTodayCategory] = useState<DrillCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      
      {/* Header */}
      <div className="p-8 border-b border-black bg-brand-cream">
         <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Drills</h1>
         <p className="text-lg max-w-xl">Latihan fokus per kategori. Untuk akun Gratis, hanya 1 drill terbuka per hari.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
          {packs.map((pack) => (
              <BonusCard
                key={pack.id}
                pack={pack}
                onClick={() => {
                  const category = pack.subject as DrillCategory;
                  if (!isUnlocked(category)) {
                    alert('Gunakan akun Premium untuk buka semua drills');
                    return;
                  }
                  onStartDrill(category);
                }}
              />
          ))}
      </div>
    </div>
  );
};

export default BonusView;