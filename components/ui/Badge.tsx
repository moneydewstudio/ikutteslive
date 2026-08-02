import React from 'react';

type Accent = 'lime' | 'pink' | 'purple' | 'cream' | 'white';

const ACCENT: Record<Accent, string> = {
  lime: 'bg-brand-lime',
  pink: 'bg-brand-pink',
  purple: 'bg-brand-purple',
  cream: 'bg-brand-cream',
  white: 'bg-white',
};

type Props = {
  accent?: Accent;
  children: React.ReactNode;
  className?: string;
};

export const Badge: React.FC<Props> = ({ accent = 'white', children, className = '' }) => (
  <span
    className={[
      'inline-flex items-center border border-black rounded-full',
      'px-sm py-xs text-xs font-bold uppercase tracking-wide',
      ACCENT[accent],
      'text-black',
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
