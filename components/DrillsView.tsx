import React, { useCallback, useEffect, useMemo, useState } from 'react';
import QuizCard from './QuizCard';
import ResultsView from './ResultsView';
import { UserSession } from '../types';
import * as QuizService from '../services/quizService';

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

interface DrillsViewProps {
  onSignupClick: () => void;
  category?: DrillCategory;
}

// TEAM_005: daily drills view (10 questions, single-category rotation, global per Jakarta day)
const DrillsView: React.FC<DrillsViewProps> = ({ onSignupClick, category }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startDrills = useCallback(async () => {
    setIsLoading(true);
    try {
      // TEAM_018: when a category is selected (premium picker), request that category for today's daily drill set
      const newSession = category
        ? await QuizService.createDailyDrillSessionFromApiByCategory(category)
        : await QuizService.createDailyDrillSessionFromApi();
      setSession(newSession);
      setCurrentQuestionIdx(0);
    } catch (e) {
      console.error('TEAM_005 failed to start daily drills', e);
      alert('Gagal memuat drill harian. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const refreshSession = useCallback(() => {
    QuizService.clearDrillSession();
    setSession(null);
    setCurrentQuestionIdx(0);
    void startDrills();
  }, [startDrills]);

  useEffect(() => {
    const saved = QuizService.loadDrillSession();
    if (!saved) {
      void startDrills();
      return;
    }

    // TEAM_018: resume only if the saved session matches the requested category (or no category requested)
    const savedCategory = (saved.drillCategory ?? null) as DrillCategory | null;
    if (category && savedCategory && savedCategory !== category) {
      QuizService.clearDrillSession();
      void startDrills();
      return;
    }

    setSession(saved);
    const answeredCount = Object.keys(saved.answers).length;
    if (!saved.completedAt && answeredCount < saved.questionIds.length) {
      setCurrentQuestionIdx(answeredCount);
    }
  }, [category, startDrills]);

  useEffect(() => {
    if (!session?.refreshAt) return;
    const ms = session.refreshAt - Date.now();
    if (!Number.isFinite(ms)) return;

    if (ms <= 0) {
      refreshSession();
      return;
    }

    const timer = window.setTimeout(() => {
      refreshSession();
    }, ms);

    return () => window.clearTimeout(timer);
  }, [session?.refreshAt, refreshSession]);

  const questions = useMemo(() => (session ? QuizService.getQuestionsForSession(session) : []), [session]);
  const currentQ = questions[currentQuestionIdx];

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (!session) return;
      const currentId = session.questionIds[currentQuestionIdx];
      const updatedSession = {
        ...session,
        answers: { ...session.answers, [currentId]: optionId },
      };
      setSession(updatedSession);
      QuizService.saveDrillSession(updatedSession);

      setTimeout(() => {
        if (currentQuestionIdx < session.questionIds.length - 1) {
          setCurrentQuestionIdx((prev) => prev + 1);
        } else {
          const finished = QuizService.calculateResults(updatedSession, { persistHistory: false });
          setSession(finished);
          QuizService.saveDrillSession(finished);
        }
      }, 250);
    },
    [session, currentQuestionIdx]
  );

  if (isLoading && !session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-medium text-sm text-gray-500">Memuat drill harian...</span>
      </div>
    );
  }

  if (!session) return null;

  if (session.completedAt) {
    return <ResultsView session={session} onSignupClick={onSignupClick} onRetryClick={refreshSession} />;
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-80px)] animate-fade-in">
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-brand-lime transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {currentQ ? (
        <QuizCard
          question={currentQ}
          selectedOptionId={session.answers[currentQ.id]}
          onSelectOption={handleAnswer}
          questionIndex={currentQuestionIdx}
          totalQuestions={questions.length}
          hideSubjectLabel
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-medium text-sm text-gray-500">Tidak ada soal untuk drill harian.</span>
        </div>
      )}
    </div>
  );
};

export default DrillsView;
