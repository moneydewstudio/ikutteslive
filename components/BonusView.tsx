import React from 'react';
import { Lock, Star, ShoppingBag, ArrowUpRight } from 'lucide-react';
import Button from './Button';

const BonusView: React.FC = () => {
  const packs = [
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
              <div key={pack.id} className={`p-6 border-b border-black md:border-r ${pack.color} flex flex-col justify-between h-64 group hover:bg-opacity-80 transition-colors`}>
                  <div>
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-black border border-black px-2 py-0.5 rounded-full bg-white">{pack.subject}</span>
                          {pack.price === 'Locked' ? <Lock className="w-5 h-5 opacity-50" /> : <Star className="w-5 h-5 fill-black" />}
                      </div>
                      <h3 className="text-2xl font-black leading-tight mb-1">{pack.title}</h3>
                      <p className="text-sm font-medium opacity-70">{pack.questions} Questions • {pack.difficulty}</p>
                  </div>

                  <div className="mt-4">
                      {pack.price === 'Locked' ? (
                          <div className="flex items-center justify-between text-gray-400">
                             <span className="font-bold text-sm">Level 5 Required</span>
                             <Lock className="w-4 h-4" />
                          </div>
                      ) : (
                          <Button fullWidth size="sm" variant="black" className="justify-between group-hover:bg-gray-800">
                             Claim Pack <ArrowUpRight className="w-4 h-4" />
                          </Button>
                      )}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default BonusView;