import React from 'react';
import { PenTool, Zap, Trophy, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItems = [
    { id: 'QUIZ', icon: PenTool, label: 'Quiz' },
    { id: 'BONUS', icon: Zap, label: 'Bonus' },
    { id: 'TRYOUT', icon: Trophy, label: 'Tryout' },
    { id: 'PROFILE', icon: User, label: 'Stats' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 pb-6 z-50">
      <div className="flex justify-between items-center max-w-sm mx-auto px-4">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'QUIZ' && currentView === 'RESULTS');
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as ViewState)}
              className={`
                flex flex-col items-center justify-center rounded-lg transition-all duration-200
                ${isActive ? 'text-black transform scale-110' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${isActive ? 'fill-black' : 'fill-none'}`} 
                strokeWidth={isActive ? 2 : 2} 
              />
              {isActive && (
                 <span className="w-1 h-1 bg-black rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;