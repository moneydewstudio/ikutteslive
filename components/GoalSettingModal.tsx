// TEAM_033: Goal Setting Modal - Forces commitment for Outcome-Driven Loop
// Shown on first authenticated usage. Required before full progression tracking.

import React, { useState, useEffect } from 'react';
import { Target, Calendar, ArrowRight, X } from 'lucide-react';
import Button from './Button';
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
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-black">
        {/* Header */}
        <div className="bg-brand-lime p-6 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-black">Tetapkan Target</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm mt-2 text-black/80">
            Target membantu kami membuat rencana latihan yang tepat untukmu.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <>
              {/* Step 1: Target Score */}
              <div className="mb-6">
                <label className="block font-bold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Skor Tryout
                </label>

                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="range"
                    min="250"
                    max="400"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
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

                <div className="mt-4 p-3 bg-brand-cream border border-black rounded">
                  <div className="text-sm font-bold mb-1">
                    {targetScore < 300 ? (
                      <span className="text-brand-orange">Di bawah passing grade (300)</span>
                    ) : targetScore === 300 ? (
                      <span className="text-green-700">🎯 Target passing grade</span>
                    ) : (
                      <span className="text-green-700">🌟 Target di atas passing grade</span>
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

              <Button
                variant="black"
                fullWidth
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-2"
              >
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              {/* Step 2: Exam Date (Optional) */}
              <div className="mb-6">
                <label className="block font-bold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Ujian CPNS (Opsional)
                </label>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-black rounded font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Jika diisi, kami akan membuat rencana latihan otomatis menuju tanggal ini.
                </p>

                {examDate && (
                  <div className="mt-3 p-2 bg-brand-lime/30 border border-brand-lime rounded text-sm">
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSkipDate}
                  isLoading={isLoading}
                >
                  Lewati
                </Button>
                <Button
                  variant="black"
                  onClick={handleSave}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Simpan Target
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer indicator */}
        <div className="bg-gray-50 p-3 border-t border-black flex justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-black' : 'bg-gray-300'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-black' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
};

export default GoalSettingModal;
