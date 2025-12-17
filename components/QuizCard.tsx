import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  questionIndex: number;
  totalQuestions: number;
  hideSubjectLabel?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  selectedOptionId, 
  onSelectOption,
  questionIndex,
  totalQuestions,
  hideSubjectLabel = false
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      
      {/* Left: Question Content */}
      <div className="md:w-1/2 p-4 md:p-6 flex flex-col justify-center bg-brand-cream border-b md:border-b-0 md:border-r border-black overflow-y-auto">
         <div className="mb-6">
            {!hideSubjectLabel && (
              <span className="inline-block px-3 py-1 border border-black bg-white text-xs font-black uppercase tracking-widest mb-4">
                  {question.subject}
              </span>
            )}
            <p className="text-xl md:text-2xl font-bold leading-relaxed">
                {question.text}
            </p>
         </div>
      </div>

      {/* Right: Options */}
      <div className="md:w-1/2 bg-white flex flex-col justify-center p-4 pb-24 md:p-6 overflow-y-auto">
         <div className="space-y-3 max-w-md mx-auto w-full">
            {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onSelectOption(option.id)}
                        className={`
                            w-full text-left p-4 border transition-all duration-200 group flex items-start gap-4
                            ${isSelected 
                                ? 'bg-black border-black text-white' 
                                : 'bg-white border-black text-black hover:bg-gray-50'
                            }
                        `}
                    >
                        <div className={`
                            w-6 h-6 flex items-center justify-center border font-bold text-xs flex-shrink-0 mt-0.5
                            ${isSelected ? 'border-white bg-black' : 'border-black bg-gray-100 group-hover:bg-white'}
                        `}>
                            {option.id.toUpperCase()}
                        </div>
                        <span className="font-medium text-lg leading-snug">{option.text}</span>
                    </button>
                );
            })}
         </div>
      </div>

    </div>
  );
};

export default React.memo(QuizCard);