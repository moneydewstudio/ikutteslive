import React from 'react';
import { PenTool, Zap, Trophy, User, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

// TEAM_032: Mobile navigation with labels for clarity
const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItems = [
    // Primary: Tryout first (matches desktop hierarchy)
    { id: 'TRYOUT', icon: Trophy, label: 'Tryout', shortLabel: 'Tryout' },
    // Secondary: Drill (per-category practice)
    { id: 'BONUS', icon: Zap, label: 'Drill', shortLabel: 'Drill' },
    // Secondary: Kuis Harian
    { id: 'QUIZ', icon: PenTool, label: 'Kuis Harian', shortLabel: 'Kuis' },
    { id: 'BLOG', icon: BookOpen, label: 'Blog', shortLabel: 'Blog' },
    { id: 'PROFILE', icon: User, label: 'Profil', shortLabel: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black py-md pb-safe z-50" data-tour="nav-bar">
      <div className="flex justify-between items-end max-w-md mx-auto px-md">
        {navItems.map((item) => {
          const isActive =
            currentView === item.id ||
            (item.id === 'QUIZ' && currentView === 'RESULTS') ||
            (item.id === 'BONUS' && currentView === 'DRILLS');
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'BLOG') {
                  window.open('/blog/', '_blank');
                } else {
                  onChange(item.id as ViewState);
                }
              }}
              className={`
                flex flex-col items-center justify-center py-sm px-md rounded-lg transition-all duration-200 min-w-[56px]
                ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}
              `}
              data-tour={item.id === 'QUIZ' ? 'nav-latihan' : undefined}
            >
              <div className={`
                relative p-1.5 rounded-lg transition-all
                ${isActive ? 'bg-black text-white' : 'bg-transparent'}
              `}>
                <Icon 
                  className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>
              <span className={`
                text-[10px] font-bold mt-1 leading-none
                ${isActive ? 'text-black' : 'text-gray-500'}
              `}>
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;