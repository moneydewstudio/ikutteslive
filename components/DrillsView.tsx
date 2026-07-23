import React, { useCallback, useEffect, useMemo, useState } from 'react';
import QuizCard from './QuizCard';
import type { QuizExplanation } from './QuizCard';
import { UserSession } from '../types';
import * as QuizService from '../services/quizService';
import { getExplanation } from '../services/backend';
import { recordAnswerEvent } from '../services/userEvents';

type DrillCategory = 'TIU' | 'TWK' | 'TKP';

interface DrillsViewProps {
  onSignupClick: () => void;
  category?: DrillCategory;
  themeId?: number;
  onPremiumActivated?: () => Promise<void> | void;
  onBackToBonus?: () => void;
}

// TEAM_005: daily drills view (20 questions, per-category sessions, global per Jakarta day)
// TEAM_037: optional themeId for per-theme drills
// Ralph 2026-07-23: show answer + explanation per question, skip ResultsView
const DrillsView: React.FC<DrillsViewProps> = ({ onSignupClick, category, themeId, onPremiumActivated, onBackToBonus }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackQId, setFeedbackQId] = useState<string | null>(null);
  const [explanationMap, setExplanationMap] = useState<Record<string, QuizExplanation>>({});

  const clearFeedback = useCallback(() => { setFeedbackQId(null); }, []);

  const startDrills = useCallback(async () => {
    setIsLoading(true);
    clearFeedback();
    setExplanationMap({});
    try {
      const newSession = themeId && category
        ? await QuizService.createDailyDrillSessionFromApiByTheme(category, themeId)
        : category
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
  }, [category, themeId, clearFeedback]);

  const refreshSession = useCallback(() => {
    if (!category) return;
    QuizService.clearDrillSession(category);
    setSession(null);
    setCurrentQuestionIdx(0);
    void startDrills();
  }, [category, startDrills]);

  useEffect(() => {
    QuizService.migrateOldDrillSession();
    if (!category) return;
    const saved = QuizService.loadDrillSession(category);
    if (!saved) { void startDrills(); return; }
    const savedCategory = (saved.drillCategory ?? null) as DrillCategory | null;
    if (savedCategory !== category) { QuizService.clearDrillSession(category); void startDrills(); return; }
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
    if (ms <= 0) { refreshSession(); return; }
    const timer = window.setTimeout(() => { refreshSession(); }, ms);
    return () => window.clearTimeout(timer);
  }, [session?.refreshAt, refreshSession]);

  const questions = useMemo(() => (session ? QuizService.getQuestionsForSession(session) : []), [session]);
  const currentQ = questions[currentQuestionIdx];

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (!session) return;
      const currentId = session.questionIds[currentQuestionIdx];
      const q = questions[currentQuestionIdx];
      if (!q) return;
      const updatedSession = {
        ...session,
        answers: { ...session.answers, [currentId]: optionId },
      };
      setSession(updatedSession);
      QuizService.saveDrillSession(updatedSession);

      void recordAnswerEvent({
        questionId: currentId,
        isCorrect: optionId === q.correct_option_id,
      }).catch(() => null);

      // Show feedback
      setFeedbackQId(currentId);

      // Fetch explanation
      setExplanationMap((prev) => ({ ...prev, [currentId]: { status: 'loading' } }));
      getExplanation(currentId).then((res) => {
        setExplanationMap((prev) => {
          if ('explanation' in res) {
            return { ...prev, [currentId]: { status: 'ready', text: res.explanation } };
          } else if ('status' in res && res.status === 'locked') {
            return { ...prev, [currentId]: { status: 'locked', text: 'Fitur Premium' } };
          } else {
            return { ...prev, [currentId]: { status: 'error' } };
          }
        });
      }).catch(() => {
        setExplanationMap((prev) => ({ ...prev, [currentId]: { status: 'error' } }));
      });
    },
    [session, currentQuestionIdx, questions]
  );

  const handleNextQuestion = useCallback(() => {
    if (!session) return;
    const isLast = currentQuestionIdx >= session.questionIds.length - 1;
    if (isLast) {
      const finished = QuizService.calculateResults(session, { persistHistory: false });
      setSession(finished);
      QuizService.saveDrillSession(finished);
    } else {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
    clearFeedback();
  }, [session, currentQuestionIdx, clearFeedback]);

  if (isLoading && !session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-medium text-sm text-gray-500">Memuat drill harian...</span>
      </div>
    );
  }

  if (!session) return null;

  // Ralph: simple completion card instead of ResultsView
  if (session.completedAt) {
    const correctCount = session.score ?? 0;
    const total = questions.length;
    return (
      <div className="flex-1 flex items-center justify-center p-lg">
        <div className="max-w-sm w-full border border-black bg-white p-8 text-center space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight">Selesai! &#x1F389;</h2>
          <p className="text-lg font-bold">{correctCount} / {total} benar</p>
          <button
            onClick={refreshSession}
            className="inline-block px-6 py-3 bg-black text-white font-bold text-sm border border-black hover:bg-gray-800 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={onBackToBonus}
            className="inline-block px-6 py-3 bg-white text-black font-bold text-sm border border-black hover:bg-gray-100 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const isShowingFeedback = feedbackQId === currentQ?.id;

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
          correctOptionId={isShowingFeedback ? currentQ.correct_option_id : undefined}
          showFeedback={isShowingFeedback}
          explanation={isShowingFeedback ? (explanationMap[currentQ.id] ?? null) : null}
          onNextQuestion={isShowingFeedback ? handleNextQuestion : undefined}
          isLastQuestion={currentQuestionIdx >= session.questionIds.length - 1}
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