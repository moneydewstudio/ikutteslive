import React from 'react';
import { Question } from '../types';
import { motion } from 'motion/react';
import OptionButton from './ui/OptionButton';
import CTA from './ui/CTA';

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
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden pb-xl md:pb-0">

      {/* Left: Question Content */}
      <div className="md:w-[35%] p-lg md:p-2xl flex flex-none md:flex-initial flex-col justify-start md:justify-center bg-brand-cream border-b md:border-b-0 md:border-r border-black overflow-y-auto max-h-[35vh] md:max-h-none min-h-0">
         <div className="mb-lg md:mb-xl">
            {!hideSubjectLabel && (
              <span className="inline-flex px-md py-xs border border-black bg-white text-xs font-black uppercase tracking-widest mb-lg">
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
         <div className="grid grid-cols-1 gap-sm md:gap-md max-w-none mx-auto w-full">
            {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = showFeedback && option.id === correctOptionId;
                const isWrong = showFeedback && isSelected && option.id !== correctOptionId;
                const state = isCorrect
                  ? 'correct'
                  : isWrong
                  ? 'wrong'
                  : isSelected && !showFeedback
                  ? 'selected'
                  : showFeedback
                  ? 'dimmed'
                  : 'idle';

                return (
                    <motion.div
                        key={option.id}
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
                    >
                        <OptionButton
                            state={state}
                            letter={option.id.toUpperCase()}
                            marker={isCorrect ? '✓' : isWrong ? '✗' : undefined}
                            onClick={() => onSelectOption(option.id)}
                        >
                            {option.text}
                        </OptionButton>
                    </motion.div>
                );
            })}
         </div>

         {/* Per-question explanation panel */}
         {showFeedback && explanation && (
           <div className="mt-lg border border-black bg-brand-cream p-lg text-sm space-y-sm">
             <span className="font-black uppercase text-xs block text-gray-500">Pembahasan</span>
             {explanation.status === 'loading' && (
               <p className="text-gray-500 italic">Memuat pembahasan...</p>
             )}
             {explanation.status === 'ready' && (
               <p className="leading-relaxed">{explanation.text}</p>
             )}
             {explanation.status === 'locked' && (
               <div className="flex items-center justify-between gap-md p-md border border-black bg-white">
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
           <div className="mt-lg flex justify-end">
             <CTA onClick={onNextQuestion} size="md">
               {nextButtonLabel || (isLastQuestion ? 'Selesai' : 'Lanjut')}
             </CTA>
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
