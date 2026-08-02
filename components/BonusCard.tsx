import React from 'react';
import { Lock, Star } from 'lucide-react';
import CTA from './ui/CTA';
import Badge from './ui/Badge';

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

/**
 * Hero card can't reuse Card primitive: active hero needs brand-lime fill
 * with no hover wash, locked needs dim + lock icon. A real <button> keeps one
 * focus ring without bolting hero-state onto Card. Locked stays enabled so
 * parent routes the tap to openPaywall.
 */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

const BonusCard: React.FC<BonusCardProps> = ({ pack, onClick }) => {
  const locked = pack.price === 'Terkunci';
  const active = !locked && pack.difficulty === 'Harian';
  const interactive = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-col justify-between h-64 w-full text-left border border-black rounded-xl p-xl',
        'transition-colors',
        locked ? 'bg-white opacity-60' : '',
        active ? 'bg-brand-lime' : 'bg-white',
        interactive ? 'hover:bg-gray-50' : '',
        interactive ? FOCUS : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <div className="flex justify-between items-start mb-lg">
          <Badge>{pack.subject}</Badge>
          {locked ? (
            <Lock className="w-5 h-5 opacity-50" aria-hidden="true" />
          ) : (
            <Star className="w-5 h-5 fill-black" aria-hidden="true" />
          )}
        </div>
        <h3 className="text-2xl font-black leading-tight mb-sm">{pack.title}</h3>
        <p className="text-sm font-medium text-gray-600">{pack.questions} Soal</p>
      </div>

      <div className="mt-lg">
        {locked ? (
          <div>
            {/* TEAM_032: Clear lock explanation - why not just value */}
            <div className="flex items-center gap-sm mb-sm">
              <Lock className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span className="text-xs font-bold text-gray-500 uppercase">Terkunci Hari Ini</span>
            </div>
            <div className="text-xs font-medium text-gray-600 mb-md">
              Buka dengan Premium untuk latihan semua kategori tanpa batas
            </div>
          </div>
        ) : (
          <CTA fullWidth size="sm" variant={active ? 'primary' : 'secondary'}>
            Mulai Drill
          </CTA>
        )}
      </div>
    </button>
  );
};

export default BonusCard;