import React from 'react';
import { Question } from '../types';
import { motion } from 'motion/react';

export type QuizExplanation = { status: 'loading'; text?: undefined }
  | { status: 'ready'; text: string }
  | { status: 'locked'; text: string }
  | { status: 'error'; text?: string };

interface QuizCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  questionIndex: number;
  totalQuestions: number;
  hideSubjectLabel?: boolean;
  // Playful feedback props
  correctOptionId?: string;
  showFeedback?: boolean;
  // Drill per-question explanation & navigation
  explanation?: QuizExplanation | null;
  nextButtonLabel?: string;
  onNextQuestion?: () => void;
  isLastQuestion?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  questionIndex,
  totalQuestions,
  hideSubjectLabel = false,
  correctOptionId,
  showFeedback,
  explanation,
  nextButtonLabel,
  onNextQuestion,
  isLastQuestion,
}) => {
  return (
    // TEAM_011: restore split scrolling and set a 35/65 desktop ratio so answers have more space
    // TEAM_014: prevent mobile answer overlap by bounding question height and letting answers scroll
    // TODO(TEAM_014): verify on mobile that answers no longer overlap question content
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden pb-24 md:pb-0">

      {/* Left: Question Content */}
      <div className="md:w-[35%] p-lg md:p-2xl flex flex-none md:flex-initial flex-col justify-start md:justify-center bg-brand-cream border-b md:border-b-0 md:border-r border-black overflow-y-auto max-h-[35vh] md:max-h-none min-h-0">
         <div className="mb-4 md:mb-6">
            {!hideSubjectLabel && (
              <span className="inline-block px-3 py-1 border border-black bg-white text-xs font-black uppercase tracking-widest mb-4">
                  {question.subject}
              </span>
            )}
            <p className="text-sm md:text-lg font-bold leading-snug">
                {question.text}
            </p>
         </div>
      </div>

      {/* Right: Options with Playful Feedback + Explanation */}
      <div className="md:w-[65%] bg-white flex flex-1 md:flex-none flex-col justify-start p-lg md:p-2xl overflow-y-auto min-h-0">
         <div className="grid grid-cols-1 gap-2 md:gap-3 max-w-none mx-auto w-full">
            {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = showFeedback && option.id === correctOptionId;
                const isWrong = showFeedback && isSelected && option.id !== correctOptionId;

                return (
                    <motion.button
                        key={option.id}
                        onClick={() => onSelectOption(option.id)}
                        disabled={showFeedback}
                        whileTap={showFeedback ? {} : { scale: 0.985 }}
                        animate={
                            isWrong
                                ? { x: [0, -6, 6, -6, 6, 0] }
                                : isCorrect
                                ? { scale: [1, 1.04, 1] }
                                : {}
                        }
                        transition={{
                            duration: isWrong ? 0.4 : 0.35,
                            ease: isCorrect ? [0.23, 1.0, 0.32, 1] : "easeInOut"
                        }}
                        className={`
                            w-full text-left p-3 md:p-4 border transition-all duration-200 group flex items-start gap-3
                            ${isSelected && !showFeedback
                                ? 'bg-black border-black text-white'
                                : isCorrect
                                ? 'bg-[#00CC66] border-black text-white'
                                : isWrong
                                ? 'bg-[#FF4444] border-black text-white'
                                : 'bg-white border-black text-black hover:bg-gray-50'
                            }
                            ${showFeedback ? 'cursor-default' : ''}
                        `}
                    >
                        <div className={`
                            w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border font-bold text-[10px] md:text-xs flex-shrink-0 mt-0.5
                            ${isSelected || isCorrect || isWrong
                                ? 'border-white bg-black'
                                : 'border-black bg-gray-100 group-hover:bg-white'
                            }
                        `}>
                            {option.id.toUpperCase()}
                        </div>
                        <span className="font-medium text-sm md:text-base leading-snug">{option.text}</span>
                    </motion.button>
                );
            })}
         </div>

         {/* Per-question explanation panel */}
         {showFeedback && explanation && (
           <div className="mt-4 border border-black bg-brand-cream p-4 text-sm space-y-2">
             <span className="font-black uppercase text-xs block text-gray-500">Pembahasan</span>
             {explanation.status === 'loading' && (
               <p className="text-gray-500 italic">Memuat pembahasan...</p>
             )}
             {explanation.status === 'ready' && (
               <p className="leading-relaxed">{explanation.text}</p>
             )}
             {explanation.status === 'locked' && (
               <div className="flex items-center justify-between gap-3 p-3 border border-black bg-white">
                 <p className="text-sm font-medium">Fitur Premium. Tingkatkan akun untuk melihat pembahasan.</p>
               </div>
             )}
             {explanation.status === 'error' && (
               <p className="text-gray-500 italic">Pembahasan tidak tersedia saat ini.</p>
             )}
           </div>
         )}

         {/* Next question button */}
         {showFeedback && onNextQuestion && (
           <div className="mt-4 flex justify-end">
             <button
               onClick={onNextQuestion}
               className="px-6 py-3 bg-black text-white font-bold text-sm border border-black hover:bg-gray-800 transition-colors"
             >
               {nextButtonLabel || (isLastQuestion ? 'Selesai' : 'Lanjut')}
             </button>
           </div>
         )}
      </div>

    </div>
  );
};

export default React.memo(QuizCard);

/*
  PLAYFUL ANSWER FEEDBACK (Hybrid Brutalist + Duolingo-style)

  Cara pakai:
  <QuizCard
    ...
    correctOptionId="b"           // ID jawaban benar
    showFeedback={true}           // Tampilkan feedback warna + animasi
  />

  Behavior:
  - Jawaban benar  → hijau (#00CC66) + bounce scale
  - Jawaban salah  → merah (#FF4444) + shake
  - Tetap pakai border hitam + brutalist base

  Catatan: Animasi pakai motion/react (bukan framer-motion legacy)
*/
