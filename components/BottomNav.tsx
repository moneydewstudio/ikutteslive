import React from 'react';
import { PenTool, Zap, Trophy, User, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItems = [
    // TEAM_020: reorder bottom nav so Drills is the default/first entry
    // TEAM_018: use BONUS as the Drills entry; DRILLS is an internal runner view
    { id: 'BONUS', icon: Zap, label: 'Drills' },
    { id: 'QUIZ', icon: PenTool, label: 'Latihan' },
    { id: 'TRYOUT', icon: Trophy, label: 'Tryout' },
    { id: 'BLOG', icon: BookOpen, label: 'Blog' },
    { id: 'PROFILE', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 pb-6 z-50" data-tour="nav-bar">
      <div className="flex justify-between items-center max-w-sm mx-auto px-4">
        {navItems.map((item) => {
          // TEAM_020: highlight Drills while inside the DRILLS runner view
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
                flex flex-col items-center justify-center rounded-lg transition-all duration-200
                ${isActive ? 'text-black transform scale-110' : 'text-gray-400 hover:text-gray-600'}
              `}
              data-tour={item.id === 'QUIZ' ? 'nav-latihan' : undefined}
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