// TEAM_033: Goal Setting Modal - Forces commitment for Outcome-Driven Loop
// Shown on first authenticated usage. Required before full progression tracking.

import React, { useState, useEffect } from 'react';
import { Target, Calendar, ArrowRight, X } from 'lucide-react';
import { FOCUS } from './ui/Card';
import { CTA } from './ui/CTA';
import { apiFetch } from '../services/apiClient';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: { targetScore: number; examDate: string | null }) => void;
  userEmail?: string;
}

const GoalSettingModal: React.FC<GoalSettingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userEmail,
}) => {
  const [targetScore, setTargetScore] = useState(300);
  const [examDate, setExamDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: goal, 2: date (optional)

  // Load existing preferences if available
  useEffect(() => {
    if (!isOpen || !userEmail) return;

    const loadPrefs = async () => {
      try {
        const res = await apiFetch('/user/preferences');
        if (res.ok) {
          const data = await res.json();
          if (data.hasSetGoals) {
            setTargetScore(data.targetScore || 300);
            if (data.examDate) {
              // Format date for input (YYYY-MM-DD)
              const d = new Date(data.examDate);
              setExamDate(d.toISOString().split('T')[0]);
            }
          }
        }
      } catch (e) {
        // Silently fail - defaults are already set
      }
    };

    void loadPrefs();
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/user/preferences', {
        method: 'POST',
        body: JSON.stringify({
          targetScore,
          examDate: examDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save goals');
      }

      onSave({ targetScore, examDate: examDate || null });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan target. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipDate = () => {
    setExamDate('');
    void handleSave();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-lg">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden border border-black">
        {/* Header */}
        <div className="bg-brand-lime p-xl border-b border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Target className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-xl font-black">Tetapkan Target</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={['p-xs hover:bg-black hover:text-white rounded-xl transition-colors', FOCUS].join(' ')}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm mt-sm text-black/80">
            Target membantu kami membuat rencana latihan yang tepat untukmu.
          </p>
        </div>

        {/* Content */}
        <div className="p-xl">
          {step === 1 ? (
            <>
              {/* Step 1: Target Score */}
              <div className="mb-xl">
                <label className="block font-bold mb-md flex items-center gap-sm">
                  <Target className="w-4 h-4" aria-hidden="true" />
                  Target Skor Tryout
                </label>

                <div className="flex items-center gap-lg mb-lg">
                  <input
                    type="range"
                    min="250"
                    max="400"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-black"
                  />
                  <div className="w-20 text-center">
                    <span className="text-2xl font-black">{targetScore}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>250 (aman)</span>
                  <span>300 (lulus)</span>
                  <span>400 (tinggi)</span>
                </div>

                <div className="mt-lg p-md bg-brand-cream border border-black rounded-xl">
                  <div className="text-sm font-bold mb-xs">
                    {targetScore < 300 ? (
                      <span className="text-brand-orange">Di bawah passing grade (300)</span>
                    ) : targetScore === 300 ? (
                      <span className="text-feedback-green">Target passing grade</span>
                    ) : (
                      <span className="text-feedback-green">Target di atas passing grade</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {targetScore < 300
                      ? 'Latihan lebih intensif diperlukan untuk mencapai passing grade.'
                      : targetScore === 300
                      ? 'Target minimal untuk lulus seleksi CPNS.'
                      : 'Target ambisius—memerlukan konsistensi tinggi.'}
                  </p>
                </div>
              </div>

              <CTA
                variant="primary"
                fullWidth
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-sm"
              >
                Lanjutkan <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CTA>
            </>
          ) : (
            <>
              {/* Step 2: Exam Date (Optional) */}
              <div className="mb-xl">
                <label className="block font-bold mb-md flex items-center gap-sm">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Tanggal Ujian CPNS (Opsional)
                </label>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={['w-full p-md border border-black rounded-xl font-medium', FOCUS].join(' ')}
                />

                <p className="text-xs text-gray-500 mt-sm">
                  Jika diisi, kami akan membuat rencana latihan otomatis menuju tanggal ini.
                </p>

                {examDate && (
                  <div className="mt-md p-sm bg-brand-lime/30 border border-black rounded-xl text-sm">
                    {(() => {
                      const days = Math.ceil(
                        (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      );
                      return days > 0 ? (
                        <span className="font-medium">{days} hari menuju ujian</span>
                      ) : (
                        <span className="text-brand-orange">Tanggal sudah lewat</span>
                      );
                    })()}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-lg p-md bg-feedback-red border border-black rounded-xl text-sm text-black">
                  {error}
                </div>
              )}

              <div className="flex gap-md">
                <CTA
                  variant="secondary"
                  onClick={handleSkipDate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Lewati'}
                </CTA>
                <CTA
                  variant="primary"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Memproses...' : 'Simpan Target'}
                </CTA>
              </div>
            </>
          )}
        </div>

        {/* Footer indicator */}
        <div className="bg-gray-50 p-md border-t border-black flex justify-center gap-sm">
          <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-black' : 'bg-gray-300'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-black' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
};

export default GoalSettingModal;