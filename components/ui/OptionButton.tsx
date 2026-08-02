import React from 'react';
import { FOCUS } from './Card';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'weighted' | 'weighted-best' | 'dimmed';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  state: OptionState;
  /** Show a leading label (e.g. "A."). */
  letter?: string;
  /** Show trailing marker (e.g. "+3 poin", "✓"). */
  marker?: React.ReactNode;
};

export const STATE: Record<OptionState, string> = {
  idle: 'bg-white text-black hover:bg-gray-50',
  selected: 'bg-brand-lime text-black font-bold',
  correct: 'bg-feedback-green text-black font-bold',
  wrong: 'bg-feedback-red text-black',
  weighted: 'bg-brand-orange text-black',
  'weighted-best': 'bg-brand-lime text-black font-bold',
  dimmed: 'bg-white text-gray-500',
};

export const OptionButton: React.FC<Props> = ({
  state,
  letter,
  marker,
  className = '',
  children,
  ...props
}) => {
  const interactive = state === 'idle';
  return (
    <button
      type="button"
      aria-pressed={state === 'selected'}
      disabled={!interactive}
      {...props}
      className={[
        'w-full text-left border border-black rounded-xl px-lg py-md text-base transition-colors',
        STATE[state],
        interactive ? FOCUS : 'cursor-default',
        className,
      ].join(' ')}
    >
      <span className="flex items-center justify-between gap-md">
        <span className="flex items-start gap-sm min-w-0">
          {letter != null && (
            <span className="font-bold uppercase shrink-0" aria-hidden="true">
              {letter}.
            </span>
          )}
          <span className="min-w-0">{children}</span>
        </span>
        {marker != null && <span className="shrink-0 text-sm font-bold" aria-hidden="true">{marker}</span>}
      </span>
    </button>
  );
};

export default OptionButton;
