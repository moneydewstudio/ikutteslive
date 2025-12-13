import React from 'react';
import BonusCard, { Pack } from './BonusCard';

const BonusView: React.FC = () => {
  const packs: Pack[] = [
      { id: 1, title: 'Logic Mastery', subject: 'TIU', questions: 20, difficulty: 'Hard', price: 'Free', color: 'bg-brand-pink' },
      { id: 2, title: 'Nationality V1', subject: 'TWK', questions: 15, difficulty: 'Medium', price: 'Locked', color: 'bg-white' },
      { id: 3, title: 'Personality Plus', subject: 'TKP', questions: 25, difficulty: 'Easy', price: 'Locked', color: 'bg-white' },
      { id: 4, title: 'Exam Simulation', subject: 'ALL', questions: 100, difficulty: 'Mixed', price: 'Locked', color: 'bg-white' },
      { id: 5, title: 'Math Speed', subject: 'TIU', questions: 10, difficulty: 'Hard', price: 'Locked', color: 'bg-white' },
      { id: 6, title: 'History Buff', subject: 'TWK', questions: 20, difficulty: 'Medium', price: 'Locked', color: 'bg-white' },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
      
      {/* Header */}
      <div className="p-8 border-b border-black bg-brand-cream">
         <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Marketplace</h1>
         <p className="text-lg max-w-xl">Unlock specialized question packs to target your weak points. Collect them all to maximize your readiness.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
              <BonusCard key={pack.id} pack={pack} />
          ))}
      </div>
    </div>
  );
};

export default BonusView;