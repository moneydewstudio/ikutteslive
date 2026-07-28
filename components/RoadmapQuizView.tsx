import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../services/apiClient';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

type Option = { id: string; text: string };
type Question = {
  id: number;
  subject: string;
  difficulty: number;
  text: string;
  options: Option[];
  correct_option_id: string;
  explanation: string;
};

type Props = {
  subtopicId: number;
  subtopicName?: string;
  onBack: () => void;
  onComplete: (score: number, subtopicId: number) => void;
};

const RoadmapQuizView: React.FC<Props> = ({ subtopicId, subtopicName, onBack, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/roadmap/test?subtopicId=${subtopicId}`);
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          if (!cancelled) setError(errText || 'Gagal memuat soal');
          return;
        }
        const json = await res.json();
        const qs = (json?.questions ?? []) as Question[];
        if (!cancelled) {
          if (!qs.length) {
            setError('Belum ada soal untuk subtopik ini.');
          } else {
            setQuestions(qs);
          }
        }
      } catch {
        if (!cancelled) setError('Gagal memuat soal. Periksa koneksi Anda.');
      }
      if (!cancelled) setLoading(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [subtopicId]);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(confirmed).length;
  const progressPct = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleSelectOption = (optionId: string) => {
    if (confirmed[String(currentQuestion.id)]) return;
    setAnswers((prev) => ({ ...prev, [String(currentQuestion.id)]: optionId }));
  };

  const handleConfirm = () => {
    const qid = String(currentQuestion.id);
    if (!answers[qid]) return;
    setConfirmed((prev) => ({ ...prev, [qid]: true }));
    setShowExplanation((prev) => ({ ...prev, [qid]: true }));
  };

  const toggleExplanation = () => {
    const qid = String(currentQuestion.id);
    setShowExplanation((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const goNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const finish = () => {
    setFinished(true);
  };

  const score = useMemo(() => {
    if (!finished) return 0;
    let correct = 0;
    for (const q of questions) {
      const ans = confirmed[String(q.id)] ? answers[String(q.id)] : undefined;
      if (ans && ans === q.correct_option_id) correct++;
    }
    return Math.round((correct / totalQuestions) * 100);
  }, [finished, questions, answers, confirmed, totalQuestions]);

  // Submit progress to backend
  useEffect(() => {
    if (!finished) return;
    if (score < 70) return;
    const status = score >= 70 ? 'completed' : 'in_progress';
    void apiFetch('/roadmap/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subtopicId,
        status,
        bestScore: score,
        incrementAttempts: true,
      }),
    }).catch(() => {});
  }, [finished, score, subtopicId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-10 h-10 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-lg" />
          <span className="font-medium text-sm text-gray-500">Memuat soal...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-xl p-2xl">
        <XCircle className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 text-sm text-center">{error}</p>
        <button onClick={onBack} className="text-sm font-bold text-black underline">Kembali</button>
      </div>
    );
  }

  if (finished) {
    const passed = score >= 70;
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          {passed ? (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-xl">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-xl">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}

          <h2 className="text-2xl font-black mb-sm">
            {passed ? 'Selamat! 🎉' : 'Belum Lulus'}
          </h2>
          <p className="text-sm text-gray-500 mb-lg">
            {passed
              ? 'Kamu berhasil menyelesaikan subtopik ini!'
              : `Skor kamu ${score}%. Minimal 70% untuk lulus.`}
          </p>

          <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center mx-auto mb-xl">
            <span className={`text-3xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score}%
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {passed ? (
              <button
                onClick={() => onComplete(score, subtopicId)}
                className="w-full bg-black text-white font-bold py-3 px-xl rounded-xl hover:bg-gray-800 transition-colors"
              >
                Kembali ke Roadmap
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFinished(false);
                    setCurrentIdx(0);
                  }}
                  className="w-full bg-black text-white font-bold py-3 px-xl rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Coba Lagi
                </button>
                <button
                  onClick={() => onComplete(score, subtopicId)}
                  className="w-full text-gray-600 font-bold py-3 px-xl rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Kembali ke Roadmap
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const isConfirmed = confirmed[String(currentQuestion.id)];
  const selectedOption = answers[String(currentQuestion.id)];
  const isCorrect = isConfirmed && selectedOption === currentQuestion.correct_option_id;

  return (
    <div className="flex flex-col w-full h-full min-h-0 animate-fade-in">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-2xl h-14">
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Keluar
          </button>
          <span className="text-sm font-bold text-gray-400">
            {currentIdx + 1}/{totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-black transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-2xl py-sm overflow-x-auto">
          {questions.map((q, i) => {
            const qid = String(q.id);
            const isAnswered = !!confirmed[qid];
            const isCurrent = i === currentIdx;
            const qCorrect = isAnswered && answers[qid] === q.correct_option_id;
            const qWrong = isAnswered && answers[qid] !== q.correct_option_id;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isCurrent
                    ? 'ring-2 ring-black ring-offset-1'
                    : ''
                } ${
                  qCorrect
                    ? 'bg-green-500 text-white'
                    : qWrong
                    ? 'bg-red-500 text-white'
                    : isAnswered
                    ? 'bg-gray-300 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {qCorrect ? '✓' : qWrong ? '✗' : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-2xl"
          >
            {/* Subject badge + difficulty */}
            <div className="flex items-center gap-sm mb-lg">
              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                {currentQuestion.subject}
              </span>
              <span className="text-[10px] text-gray-400">
                {'★'.repeat(currentQuestion.difficulty)}{'☆'.repeat(5 - currentQuestion.difficulty)}
              </span>
            </div>

            {/* Question text */}
            <h3 className="text-base font-bold leading-relaxed mb-xl">
              {currentQuestion.text}
            </h3>

            {/* Options */}
            <div className="space-y-sm">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.id === currentQuestion.correct_option_id;
                let classes = 'w-full text-left border-2 rounded-xl px-lg py-md text-sm transition-all';

                if (isConfirmed) {
                  if (isCorrectOpt) {
                    classes += ' border-green-500 bg-green-50 text-green-900 font-bold';
                  } else if (isSelected && !isCorrectOpt) {
                    classes += ' border-red-500 bg-red-50 text-red-900';
                  } else {
                    classes += ' border-gray-100 text-gray-400';
                  }
                } else if (isSelected) {
                  classes += ' border-black bg-gray-50';
                } else {
                  classes += ' border-gray-200 hover:border-gray-400';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isConfirmed}
                    className={classes}
                  >
                    <span className="font-bold mr-sm uppercase">{opt.id}.</span>
                    {opt.text}
                    {isConfirmed && isCorrectOpt && ' ✅'}
                    {isConfirmed && isSelected && !isCorrectOpt && ' ❌'}
                  </button>
                );
              })}
            </div>

            {/* Confirm button or feedback */}
            {!isConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-xl"
              >
                <button
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className={`w-full font-bold text-base py-3 px-xl rounded-xl transition-colors ${
                    selectedOption
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Konfirmasi Jawaban
                </button>
              </motion.div>
            )}

            {/* Feedback + explanation */}
            {isConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-xl space-y-md"
              >
                <div className={`flex items-center gap-2 font-bold text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {isCorrect ? 'Benar!' : 'Kurang tepat'}
                </div>

                <button
                  onClick={toggleExplanation}
                  className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showExplanation[String(currentQuestion.id)] ? 'Sembunyikan' : 'Lihat'} Pembahasan
                  {showExplanation[String(currentQuestion.id)] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <AnimatePresence>
                  {showExplanation[String(currentQuestion.id)] && currentQuestion.explanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-lg bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2xl py-md">
        <div className="flex items-center gap-md">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-sm font-bold text-gray-500 disabled:text-gray-200 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <div className="flex-1" />

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-sm font-bold text-black hover:text-gray-600 transition-colors"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="bg-black text-white font-bold text-sm py-2 px-lg rounded-xl hover:bg-gray-800 transition-colors"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapQuizView;
