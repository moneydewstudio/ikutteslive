import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full h-4 bg-white border-3 border-black rounded-full overflow-hidden mb-lg relative">
      <div 
        className="h-full bg-brand-yellow transition-all duration-300 ease-out border-r-3 border-black"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;