import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UserSession } from '../types';
import { ChevronDown, ChevronUp, Check, Share2, RefreshCw, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { CTA } from './ui/CTA';
import { FOCUS } from './ui/Card';
import { getQuestionsForSession } from '../services/quizService';
import { getExplanation } from '../services/backend';
import ShareResultModal from './ShareResultModal';
import DailyQuizShareCard from '../src/components/share/DailyQuizShareCard';
import { toPng } from 'html-to-image';
import { SHARE_CAPTION, SHARE_LINK_QUIZ } from '../src/constants/share';
import type { DailyQuizShareData } from '../src/types/share';
import { waitForCardAssets } from '../src/utils/share';
import { useOnboardingTour } from '../src/contexts/OnboardingTourContext';
import PaywallModal from './PaywallModal';
import PaymentModal from './PaymentModal';

// TEAM_001: render results from session-embedded API questions instead of placeholder pool

interface ResultsViewProps {
  session: UserSession;
  onSignupClick: () => void;
  onRetryClick: () => void;
  onPremiumActivated?: () => Promise<void> | void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onSignupClick, onRetryClick, onPremiumActivated }) => {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [expState, setExpState] = useState<Record<string, { status: 'idle' | 'loading' | 'ready' | 'locked' | 'error'; text?: string }>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [shareImageState, setShareImageState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentCtx, setPaymentCtx] = useState<{ paymentId: string; planType: '3_day' | '30_day' } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoShareTriggeredRef = useRef<string | null>(null); // Guard to prevent repeated auto-triggers per session.id
  const { isTourActive } = useOnboardingTour();

  const openPaywall = () => {
    setShowPaywall(true);
  };

  const handlePaymentConfirmed = useCallback(async () => {
    try {
      await onPremiumActivated?.();
    } finally {
      setPaymentCtx(null);
      setShowPaywall(false);
      setExpState({});
    }
  }, [onPremiumActivated]);

  const fetchExplanationIfNeeded = async (id: string) => {
    const state = expState[id]?.status || 'idle';
    if (state === 'ready' || state === 'locked' || state === 'loading') return;
    setExpState((s) => ({ ...s, [id]: { status: 'loading' } }));
    try {
      const res = await getExplanation(id);
      if ('explanation' in res) {
        setExpState((s) => ({ ...s, [id]: { status: 'ready', text: res.explanation } }));
      } else if ('status' in res) {
        setExpState((s) => ({ ...s, [id]: { status: 'locked' } }));
      } else {
        setExpState((s) => ({ ...s, [id]: { status: 'error' } }));
      }
    } catch {
      setExpState((s) => ({ ...s, [id]: { status: 'error' } }));
    }
  };

  const toggleQuestion = (id: string) => {
    const next = openQuestionId === id ? null : id;
    setOpenQuestionId(next);
    if (next) fetchExplanationIfNeeded(next);
  };

  const generateImage = useCallback(async (): Promise<string | null> => {
    const node = cardRef.current;
    if (!node) return null;

    const t0 = performance.now();
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    console.info('[share_capture] preflight', {
      kind: 'daily_quiz',
      timestamp: Date.now(),
      nodeExists: !!node,
      offsetWidth: node.offsetWidth,
      offsetHeight: node.offsetHeight,
      boundingRect: { w: rect.width, h: rect.height, top: rect.top, left: rect.left },
      computedFontFamily: style.fontFamily,
      computedBgColor: style.backgroundColor,
      images: [...node.querySelectorAll('img')].map((img) => ({
        src: img.src,
        currentSrc: img.currentSrc,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      })),
    });

    const sheets = [...document.styleSheets].map((sheet) => {
      let readable = false;
      try {
        void sheet.cssRules;
        readable = true;
      } catch {
        /* blocked */
      }
      return { href: sheet.href ?? '(inline)', readable };
    });
    console.info('[share_capture] stylesheets', {
      total: sheets.length,
      blocked: sheets.filter((s) => !s.readable).map((s) => s.href),
    });

    try {
      const t1 = performance.now();
      // TEAM_016: wait for fonts + images to load/decode to avoid blank captures
      await waitForCardAssets(node);
      const t2 = performance.now();
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          position: 'static',
          left: 'auto',
          top: 'auto',
        },
        backgroundColor: '#f5f5dc',
      });
      const t3 = performance.now();

      console.info('[share_capture] timing_ms', {
        raf: Math.round(t1 - t0),
        assets: Math.round(t2 - t1),
        capture: Math.round(t3 - t2),
        total: Math.round(t3 - t0),
      });

      console.info('[share_capture] result', {
        dataUrlLength: dataUrl.length,
        startsWithPng: dataUrl.startsWith('data:image/png'),
        likelyBlank: dataUrl.length < 2_000,
      });

      return dataUrl;
    } catch (err: unknown) {
      console.error('[share_capture] error', {
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      return null;
    }
  }, []);

  const handleShareClick = useCallback(() => {
    // If modal is already open, do nothing
    if (showShareModal) return;

    void (async () => {
      setShowShareModal(true);
      // If image is ready, reuse it; otherwise show loading and regenerate
      if (shareImageState === 'ready' && shareImageUrl) {
        // No need to regenerate; modal will show cached image
        return;
      }
      setShareImageState('loading');
      setIsGenerating(true);
      try {
        // TEAM_016: allow offscreen card to render before capture
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
        const dataUrl = await generateImage();
        if (dataUrl) {
          setShareImageUrl(dataUrl);
          setShareImageState('ready');
        } else {
          setShareImageState('error');
        }
      } catch {
        setShareImageState('error');
      } finally {
        setIsGenerating(false);
      }
    })();
  }, [showShareModal, shareImageState, shareImageUrl, generateImage]);

  const handleRetryGenerate = useCallback(() => {
    handleShareClick();
  }, [handleShareClick]);

  const questions = getQuestionsForSession(session);
  const correctAnswers = session.score;
  const totalQuestions = questions.length;

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const readiness = session.readiness >= 80 ? 'Sangat Siap' : session.readiness >= 60 ? 'Siap' : session.readiness >= 40 ? 'Cukup Siap' : 'Perlu Latihan';

  // TEAM_032: Context-aware result messaging
  const getResultMessage = (pct: number) => {
    if (pct >= 80) return {
      headline: 'Skor Tinggi! 🌟',
      subtext: 'Pertahankan performa ini dengan latihan rutin. Kamu sudah di jalur yang benar.',
      mood: 'excellent' as const
    };
    if (pct >= 60) return {
      headline: 'Menuju Siap 📈',
      subtext: 'Tingkatkan latihan untuk mencapai passing grade. Konsistensi adalah kunci.',
      mood: 'good' as const
    };
    if (pct >= 40) return {
      headline: 'Perlu Latihan Intensif 💪',
      subtext: 'Jangan khawatir, skor ini normal untuk pemula. Yuk, latihan tiap hari!',
      mood: 'needs-work' as const
    };
    return {
      headline: 'Waktunya Mulai Belajar 📚',
      subtext: 'Semua expert dulunya pemula. Mulai dengan latihan harian, ya!',
      mood: 'starting' as const
    };
  };

  const resultMessage = getResultMessage(percentage);
  const shareData: DailyQuizShareData = {
    kind: 'daily_quiz',
    userName: 'User', // TODO: Get from user context
    percentage,
    correct: correctAnswers,
    total: totalQuestions,
    readiness,
    generatedAt: new Date().toISOString(),
    link: SHARE_LINK_QUIZ,
  };

  // Auto-open share modal after 1.5s on ResultsView mount (once per session.id)
  // Suppress when onboarding tour is active to avoid conflicts
  useEffect(() => {
    if (autoShareTriggeredRef.current === session.id) return;
    if (isTourActive) return; // Don't auto-open share modal during tour

    const timer = setTimeout(() => {
      autoShareTriggeredRef.current = session.id;
      setShowShareModal(true);
      setShareImageState('loading');
      setIsGenerating(true);
      generateImage()
        .then((url) => {
          if (url) {
            setShareImageUrl(url);
            setShareImageState('ready');
          } else {
            setShareImageState('error');
          }
        })
        .catch(() => {
          setShareImageState('error');
        })
        .finally(() => {
          setIsGenerating(false);
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [session.id, generateImage, isTourActive]);

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">

      {/* HERO SCORE SECTION */}
      <div className="flex flex-col md:flex-row border-b border-black">

        {/* Left: Score */}
        <div className="md:w-1/2 p-3xl bg-brand-lime border-b md:border-b-0 md:border-r border-black flex flex-col justify-center items-center text-center">
          <span className="font-bold text-xs uppercase tracking-[0.2em] mb-lg">Hasil Sesi</span>
          <h1 className="text-9xl font-black mb-sm leading-none tracking-tighter">
            {Math.round((correctAnswers / totalQuestions) * 100)}%
          </h1>
          <p className="font-bold text-xl mb-xl">Anda menjawab {correctAnswers} dari {totalQuestions} dengan benar.</p>
        </div>

        {/* Right: Actions */}
        <div className="md:w-1/2 bg-white p-2xl flex flex-col justify-center items-start space-y-lg">
          <div className={`inline-flex items-center gap-sm px-md py-sm rounded-full text-xs font-black uppercase mb-sm border border-black ${
            resultMessage.mood === 'excellent' ? 'bg-feedback-green text-black' :
            resultMessage.mood === 'good' ? 'bg-brand-lime text-black' :
            resultMessage.mood === 'needs-work' ? 'bg-brand-orange text-black' :
            'bg-brand-gray text-black'
          }`}>
            {resultMessage.mood === 'excellent' && <Check className="w-3.5 h-3.5" />}
            {resultMessage.mood === 'good' && <TrendingUp className="w-3.5 h-3.5" />}
            {resultMessage.mood === 'needs-work' && <AlertCircle className="w-3.5 h-3.5" />}
            {resultMessage.mood === 'starting' && <BookOpen className="w-3.5 h-3.5" />}
            {percentage >= 60 ? 'Di Atas Rata-rata' : 'Perlu Peningkatan'}
          </div>

          <h2 className="text-3xl font-black uppercase leading-tight">{resultMessage.headline}</h2>
          <p className="text-gray-600 mb-xl max-w-sm">{resultMessage.subtext}</p>

          <div className="flex w-full gap-md">
            <CTA onClick={onRetryClick} variant="secondary" fullWidth>
              <RefreshCw className="w-4 h-4 mr-sm" aria-hidden="true" /> Coba Lagi
            </CTA>
            <CTA onClick={handleShareClick} variant="primary" fullWidth>
              <Share2 className="w-4 h-4 mr-sm" aria-hidden="true" /> Bagikan hasil
            </CTA>
          </div>
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="bg-bg">
        <div className="p-lg border-b border-black flex items-center gap-sm bg-gray-50">
          <div className="w-2 h-2 bg-black rounded-full" aria-hidden="true"></div>
          <h3 className="font-black text-sm uppercase tracking-wider">Tinjauan Detail</h3>
        </div>

        <div>
          {questions.map((q, idx) => {
            const isCorrect = session.answers[q.id] === q.correct_option_id;
            const isOpen = openQuestionId === q.id;

            return (
              <div key={q.id} className="border-b border-black bg-white group">
                <button
                  type="button"
                  onClick={() => toggleQuestion(q.id)}
                  className={['w-full flex items-center justify-between p-xl text-left hover:bg-gray-50 transition-colors', FOCUS].join(' ')}
                >
                  <div className="flex items-center gap-xl">
                    <span className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center border border-black font-black text-sm
                      ${isCorrect ? 'bg-feedback-green text-black' : 'bg-feedback-red text-black'}
                    `}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className={`font-bold text-base md:text-lg ${isCorrect ? 'text-black' : 'text-feedback-red'}`}>
                        {isCorrect ? 'Benar' : 'Salah'}
                      </p>
                      <p className="text-sm text-gray-600 font-medium truncate max-w-[200px] md:max-w-md">
                        {q.text}
                      </p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
                </button>

                {isOpen && (
                  <div className="p-xl pt-0 pl-xl md:pl-20 max-w-3xl">
                    <div className="p-xl bg-brand-cream border border-black text-sm space-y-lg">
                      <div>
                        <span className="font-black uppercase text-xs block mb-xs text-gray-600">Pertanyaan</span>
                        <p className="font-bold text-sm md:text-lg">{q.text}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className={`p-md border border-black ${isCorrect ? 'bg-feedback-green text-black' : 'bg-brand-pink/20'}`}>
                          <span className="text-[10px] font-black uppercase mb-xs block">Jawaban Anda</span>
                          <span className="font-bold">{q.options.find(o => o.id === session.answers[q.id])?.text || 'Dilewati'}</span>
                        </div>
                        <div className="p-md border border-black bg-white">
                          <span className="text-[10px] font-black uppercase mb-xs block">Jawaban Benar</span>
                          <span className="font-bold">{q.options.find(o => o.id === q.correct_option_id)?.text}</span>
                        </div>
                      </div>

                      <div>
                        <span className="font-black uppercase text-xs block mb-xs text-gray-600">Penjelasan</span>
                        {(() => {
                          const st = expState[q.id]?.status || 'idle';
                          if (st === 'ready') {
                            return <p className="leading-relaxed">{expState[q.id]?.text}</p>;
                          }
                          if (st === 'locked') {
                            return (
                              <div className="flex items-center justify-between gap-md p-md border border-black bg-white rounded-xl">
                                <p className="text-sm font-medium">Fitur Premium. Tingkatkan akun untuk melihat pembahasan.</p>
                                <CTA variant="primary" size="sm" onClick={openPaywall}>Buka Premium</CTA>
                              </div>
                            );
                          }
                          if (st === 'loading') {
                            return <p className="text-sm text-gray-600">Memuat pembahasan...</p>;
                          }
                          return <p className="text-sm text-gray-600">Pembahasan tersedia untuk pengguna serius.</p>;
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offscreen share card */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1920px',
        }}
      >
        <DailyQuizShareCard data={shareData} />
      </div>

      {/* Share modal */}
      <ShareResultModal
        imageUrl={shareImageUrl}
        imageState={shareImageState}
        caption={SHARE_CAPTION}
        link={SHARE_LINK_QUIZ}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onRetryGenerate={handleRetryGenerate}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPaymentCreated={({ paymentId, planType }) => {
          setShowPaywall(false);
          setPaymentCtx({ paymentId, planType });
        }}
      />

      {paymentCtx ? (
        <PaymentModal
          isOpen={!!paymentCtx}
          paymentId={paymentCtx.paymentId}
          planType={paymentCtx.planType}
          onClose={() => setPaymentCtx(null)}
          onPaymentIdChange={(nextPaymentId) =>
            setPaymentCtx((prev) => (prev ? { ...prev, paymentId: nextPaymentId } : prev))
          }
          onConfirmed={handlePaymentConfirmed}
        />
      ) : null}
    </div>
  );
};

export default ResultsView;