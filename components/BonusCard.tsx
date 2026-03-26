import React from 'react';
import { Lock, Star, ArrowUpRight } from 'lucide-react';
import Button from './Button';

export interface Pack {
  id: number;
  title: string;
  subject: string;
  questions: number;
  difficulty: string;
  price: string;
  color: string;
}

interface BonusCardProps {
  pack: Pack;
  onClick?: () => void;
}

const BonusCard: React.FC<BonusCardProps> = ({ pack, onClick }) => {
  return (
    <div
      className={`p-6 border-b border-black md:border-r ${pack.color} flex flex-col justify-between h-64 group hover:bg-opacity-80 transition-colors`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-black border border-black px-2 py-0.5 rounded-full bg-white">{pack.subject}</span>
          {pack.price === 'Terkunci' ? <Lock className="w-5 h-5 opacity-50" /> : <Star className="w-5 h-5 fill-black" />}
        </div>
        <h3 className="text-2xl font-black leading-tight mb-1">{pack.title}</h3>
        <p className="text-sm font-medium opacity-70">{pack.questions} Soal</p>
      </div>

      <div className="mt-4">
        {pack.price === 'Terkunci' ? (
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-bold text-sm">Butuh Level 5</span>
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <Button fullWidth size="sm" variant="black" className="justify-between group-hover:bg-gray-800">
            Klaim Paket <ArrowUpRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BonusCard;