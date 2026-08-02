import React from 'react';
import { User } from '../types';
import { Flame, Star, BookOpen, Target, Zap, ArrowRight, LayoutGrid } from 'lucide-react';
import { CTA } from './ui/CTA';
import { FOCUS } from './ui/Card';

interface HomeViewProps {
  user: User | null;
  onStartQuiz: () => void;
  onNavigate: (view: any) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, onStartQuiz, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] md:min-h-screen">
      
      {/* SECTION 1: HERO */}
      <div className="flex flex-col lg:flex-row border-b border-black">
        {/* Left: Text Content */}
        <div className="lg:w-3/5 p-2xl lg:p-3xl flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-black bg-bg">
          <h1 className="text-5xl lg:text-7xl font-black text-black leading-tight mb-xl">
            Master CPNS<br />
            <span className="relative inline-block">
               Practice Daily
               <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-lime opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
               </svg>
            </span>
          </h1>
          <div className="flex flex-wrap gap-lg">
            <CTA onClick={onStartQuiz} size="lg" variant="primary">
              Start Quiz
            </CTA>
            <div className="flex items-center -space-x-sm ml-lg">
               {[1,2,3].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border border-bg flex items-center justify-center text-xs font-bold overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full bg-brand-lime border border-bg flex items-center justify-center text-xs font-bold z-10">
                 1k+
               </div>
               <span className="ml-xl text-sm font-bold text-gray-600">Active Learners</span>
            </div>
          </div>
        </div>

        {/* Right: Visual Elements / "Marketplace" feel */}
        <div className="lg:w-2/5 bg-bg relative overflow-hidden flex flex-col justify-center p-2xl">
           {/* Abstract grid pattern background */}
           <div className="absolute inset-0 opacity-5" 
                style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
           </div>

           <div className="relative z-10 flex flex-col gap-xl">

              {/* Element 1: Current Streak Pill */}
              <div className="flex justify-end">
                <div className="bg-brand-lime border border-black rounded-full py-md px-xl flex items-center gap-md transform -rotate-2 hover:rotate-0 transition-transform">
                   <div className="bg-black text-brand-lime p-sm rounded-full">
                      <Flame className="w-5 h-5" fill="currentColor" />
                   </div>
                   <div>
                      <span className="block text-xs font-black uppercase tracking-wider">Daily Streak</span>
                      <span className="block text-xl font-black">{user?.streak || 0} Days</span>
                   </div>
                </div>
              </div>

              {/* Element 2: Readiness Card */}
              <div className="flex justify-start">
                  <div className="bg-white border border-black rounded-xl p-lg flex items-center gap-lg max-w-xs w-full">
                     <div className="w-12 h-12 bg-brand-purple rounded-full flex items-center justify-center border border-black">
                        <Target className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-xs">
                           <span className="font-bold text-sm">Readiness</span>
                           <span className="font-black text-sm">75%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full border border-black overflow-hidden">
                           <div className="h-full bg-black w-3/4"></div>
                        </div>
                     </div>
                  </div>
              </div>

              {/* Element 3: Level Pill */}
              <div className="flex justify-end mt-lg">
                  <div className="bg-brand-pink border border-black rounded-full py-sm px-xl flex items-center gap-sm transform rotate-1">
                     <span className="font-black">Level 1 Scholar</span>
                     <ArrowRight className="w-4 h-4" />
                  </div>
              </div>

           </div>
        </div>
      </div>

      {/* SECTION 2: SPLIT BOTTOM */}
      <div className="flex flex-col md:flex-row flex-1">
        
        {/* Bottom Left: "Partners" -> Subjects */}
        <div className="md:w-1/2 lg:w-1/3 border-b md:border-b-0 md:border-r border-black p-2xl bg-white">
           <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-xl">Study Tracks</h3>
           <div className="grid grid-cols-2 gap-lg">
              <button type="button" onClick={() => onNavigate('BONUS')} className={['group flex items-center gap-md p-md rounded-xl border border-black hover:bg-gray-50 transition-colors', FOCUS].join(' ')}>
                 <BookOpen className="w-8 h-8 text-black group-hover:text-brand-lime transition-colors" />
                 <div className="text-left">
                    <span className="block font-black text-lg">TIU</span>
                    <span className="block text-xs text-gray-600">Logic & Math</span>
                 </div>
              </button>
               <button type="button" onClick={() => onNavigate('BONUS')} className={['group flex items-center gap-md p-md rounded-xl border border-black hover:bg-gray-50 transition-colors', FOCUS].join(' ')}>
                 <div className="relative">
                    <Star className="w-8 h-8 text-black group-hover:text-brand-pink transition-colors" />
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-lg">TWK</span>
                    <span className="block text-xs text-gray-600">Nationality</span>
                 </div>
              </button>
               <button type="button" onClick={() => onNavigate('BONUS')} className={['group flex items-center gap-md p-md rounded-xl border border-black hover:bg-gray-50 transition-colors', FOCUS].join(' ')}>
                 <LayoutGrid className="w-8 h-8 text-black group-hover:text-brand-purple transition-colors" />
                 <div className="text-left">
                    <span className="block font-black text-lg">TKP</span>
                    <span className="block text-xs text-gray-600">Personality</span>
                 </div>
              </button>
           </div>
        </div>

        {/* Bottom Right: "Popular Works" -> Feature/Leaderboard */}
        <div className="md:w-1/2 lg:w-2/3 p-2xl bg-brand-cream relative">
           <div className="flex justify-between items-end mb-xl border-b border-black pb-lg">
              <div>
                <h3 className="text-2xl font-black mb-xs">Live Leaderboard</h3>
                <p className="text-gray-600">Top performers today</p>
              </div>
              <CTA variant="secondary" size="sm" onClick={() => onNavigate('PROFILE')}>
                 View All
              </CTA>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-xl">
              {/* Card 1 */}
              <div className="bg-white border border-black p-lg flex gap-lg items-center">
                  <div className="w-16 h-16 bg-gray-100 border border-black flex-shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                      <div className="flex items-center gap-sm mb-xs">
                         <span className="font-black text-lg">Budi_S</span>
                         <span className="bg-brand-lime text-[10px] px-sm py-xs border border-black font-bold">#1</span>
                      </div>
                      <div className="text-xs text-gray-600 font-bold mb-sm">980 Points</div>
                      <div className="flex items-center text-xs font-bold">
                         <span className="text-green-600 flex items-center"><Zap className="w-3 h-3 mr-xs"/> Online</span>
                      </div>
                  </div>
              </div>

               {/* Card 2 */}
              <div className="bg-white border border-black p-lg flex gap-lg items-center">
                  <div className="w-16 h-16 bg-gray-100 border border-black flex-shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                      <div className="flex items-center gap-sm mb-xs">
                         <span className="font-black text-lg">Siti_99</span>
                         <span className="bg-gray-200 text-[10px] px-sm py-xs border border-black font-bold">#2</span>
                      </div>
                      <div className="text-xs text-gray-600 font-bold mb-sm">945 Points</div>
                      <div className="flex items-center text-xs font-bold">
                         <span className="text-gray-600">10m ago</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;