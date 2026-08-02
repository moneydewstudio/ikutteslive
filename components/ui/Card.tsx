import React from 'react';
import { Lock } from 'lucide-react';

export const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

type Accent = 'lime' | 'pink' | 'purple' | 'cream';

const ACCENT: Record<Accent, string> = {
  lime: 'bg-brand-lime text-black',
  pink: 'bg-brand-pink text-black',
  purple: 'bg-brand-purple text-black',
  cream: 'bg-brand-cream text-black',
};

type Props = {
  accent?: Accent;
  /** Renders <button> with hover/focus. Without it renders <div>. */
  interactive?: boolean;
  /** Locked: dimmed + disabled + lock icon. */
  locked?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  as?: 'button' | 'div';
};

const BASE = 'border border-black rounded-xl';
const POINTER = 'w-full text-left transition-colors ' + FOCUS;

export const Card: React.FC<Props> = ({
  accent,
  interactive = false,
  locked = false,
  onClick,
  className = '',
  children,
  as,
}) => {
  const bg = accent ? ACCENT[accent] : 'bg-white';
  const cls = [
    BASE,
    bg,
    locked ? 'opacity-60' : '',
    interactive && !locked ? 'hover:bg-gray-50' : '',
    interactive ? POINTER : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const el = as ?? (interactive || onClick ? 'button' : 'div');

  if (el === 'button') {
    return (
      <button type="button" onClick={onClick} disabled={locked} className={cls}>
        <span className="flex items-center justify-between w-full">
          {children}
          {locked && <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />}
        </span>
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
};

export default Card;
