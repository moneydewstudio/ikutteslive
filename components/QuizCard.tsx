import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  questionIndex: number;
  totalQuestions: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  selectedOptionId, 
  onSelectOption,
  questionIndex,
  totalQuestions
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      
      {/* Left: Question Content */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-brand-cream border-b md:border-b-0 md:border-r border-black overflow-y-auto">
         <div className="mb-6">
            <span className="inline-block px-3 py-1 border border-black bg-white text-xs font-black uppercase tracking-widest mb-4">
                {question.subject}
            </span>
            <h2 className="text-2xl md:text-4xl font-black leading-tight">
                {question.text}
            </h2>
         </div>
         <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-500">Difficulty:</span>
            <div className="flex">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${i <= question.difficulty ? 'bg-black' : 'bg-gray-300'}`} />
                ))}
            </div>
         </div>
      </div>

      {/* Right: Options */}
      <div className="md:w-1/2 bg-white flex flex-col justify-center p-6 pb-24 md:p-12 overflow-y-auto">
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

export default QuizCard;