import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  ariaLabel?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, ariaLabel }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  // fix: brand-yellow token didn't exist -> transparent fill. Use brand-lime.
  // fix: border-3 / border-r-3 -> border (1px, legacy canon).
  return (
    <div
      className="w-full h-4 bg-white border border-black rounded-full overflow-hidden mb-lg relative"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className="h-full bg-brand-lime transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;