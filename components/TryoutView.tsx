import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Calendar, ChevronRight, ArrowUpRight, Menu, X, CheckCircle, ChevronLeft, Award, RefreshCw, XCircle, Loader2, Share2 } from 'lucide-react';
import Button from './Button';
import QuizCard from './QuizCard';
import InterstitialAd from './InterstitialAd';
import { Question } from '../types';
import * as QuizService from '../services/quizService';
import ShareResultModal from './ShareResultModal';
import TryoutShareCard from '../src/components/share/TryoutShareCard';
import { toPng } from 'html-to-image';
import { SHARE_CAPTION, SHARE_LINK_TRYOUT } from '../src/constants/share';
import type { TryoutShareData } from '../src/types/share';
import { waitForCardAssets } from '../src/utils/share';
import { usePaywall } from '../src/contexts/PaywallContext';

// TEAM_004: connect Tryout (SKD) UI to server endpoints (free now; paywall-ready server-side)

// TEAM_008: use the same QuizService+apiFetch pattern as daily quiz/drills for tryout start/fetch/submit

// Extracted boundary check for testability
export const shouldShowInterstitial = (
  currentIndex: number,
  lastInterstitialAtIndex: number | null
): boolean => {
  const boundaries = [20, 40, 60, 80, 100];
  const nextIndex = currentIndex + 1;
  return boundaries.includes(nextIndex) && lastInterstitialAtIndex !== currentIndex;
};

interface ScoreResult {
  totalScore: number;
  details: {
    twk: number;
    tiu: number;
    tkp: number;
  };
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

// --- EXTRACTED & MEMOIZED COMPONENTS ---

interface GridItemProps { 
  index: number; 
  isActive: boolean; 
  isAnswered: boolean; 
  onSelect: (index: number) => void;
}

const GridItem = React.memo(({ index, isActive, isAnswered, onSelect }: GridItemProps) => {
    let styleClass = "bg-gray-500";
    if (isAnswered) styleClass = "bg-green-600";
    if (isActive) styleClass = "bg-red-500";
    
    return (
      <button
        onClick={() => onSelect(index)}
        className={`w-10 h-10 rounded text-xs font-bold flex items-center justify-center text-white transition-transform active:scale-95 ${styleClass} border border-black/10`}
      >
        {index + 1}
      </button>
    );
});

const SubmitButton = React.memo(({ onClick }: { onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full px-6 py-3 rounded border border-black bg-brand-orange text-black font-bold text-sm hover:bg-opacity-90 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
     >
        <CheckCircle className="w-4 h-4" />
        Cek Nilaimu Sekarang!
     </button>
));

const TryoutView: React.FC = () => {
  const { openPaywall } = usePaywall();
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState<string | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const submitInFlightRef = useRef(false);
  
  // Simulation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 minutes in seconds
  const [isMobileGridOpen, setIsMobileGridOpen] = useState(false);
  
  // Result State
  const [result, setResult] = useState<ScoreResult | null>(null);

  // Share State
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [shareImageState, setShareImageState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showShareModal, setShowShareModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [lastInterstitialAtIndex, setLastInterstitialAtIndex] = useState<number | null>(null);

  const resetTryout = useCallback(() => {
    setResult(null);
    setIsStarted(false);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setIsMobileGridOpen(false);
    setExamId(null);
    setEndsAt(null);
    setTimeLeft(100 * 60);
  }, []);

  const submitTryout = useCallback(async () => {
    if (!examId) return;
    if (submitInFlightRef.current) return;
    submitInFlightRef.current = true;

    setIsLoading(true);
    try {
      const { res: submitRes, data } = await QuizService.submitTryoutFromApi(examId, answers);

      if (submitRes.status === 403) {
        openPaywall('tryout_submit_403');
        return;
      }

      if (!submitRes.ok) {
        throw new Error('Failed to submit tryout');
      }

      if (!data) {
        throw new Error('Invalid submit payload');
      }

      const totalScore = Number(data?.total ?? 0);
      const twk = Number(data?.sections?.TWK ?? 0);
      const tiu = Number(data?.sections?.TIU ?? 0);
      const tkp = Number(data?.sections?.TKP ?? 0);
      const correctTwk = Number(data?.meta?.correctCount?.TWK ?? 0);
      const correctTiu = Number(data?.meta?.correctCount?.TIU ?? 0);
      const passed = !!data?.passed;

      setResult({
        totalScore: Number.isFinite(totalScore) ? totalScore : 0,
        details: {
          twk: Number.isFinite(twk) ? twk : 0,
          tiu: Number.isFinite(tiu) ? tiu : 0,
          tkp: Number.isFinite(tkp) ? tkp : 0,
        },
        correctCount: (Number.isFinite(correctTwk) ? correctTwk : 0) + (Number.isFinite(correctTiu) ? correctTiu : 0),
        totalQuestions: questions.length,
        passed,
      });
      setIsMobileGridOpen(false);
    } catch (e: any) {
      console.error('TEAM_004 submit tryout failed', e);
      alert('Gagal submit tryout. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      submitInFlightRef.current = false;
    }
  }, [examId, answers, questions.length]);

  const startTryout = useCallback(async () => {
    setIsStarted(true);
    setIsLoading(true);

    try {
      const { res: startRes, data: startData } = await QuizService.startTryoutFromApi();
      if (startRes.status === 403) {
        openPaywall('tryout_start_403');
        resetTryout();
        return;
      }
      if (!startRes.ok) throw new Error('Failed to start tryout');

      if (!startData) {
        throw new Error('Invalid exam start payload');
      }

      const newExamId = String(startData?.examId ?? '');
      const newEndsAt = Number(startData?.endsAt ?? 0);
      if (!newExamId || !Number.isFinite(newEndsAt) || newEndsAt <= 0) {
        throw new Error('Invalid exam start payload');
      }

      setExamId(newExamId);
      setEndsAt(newEndsAt);
      setAnswers({});
      setCurrentIndex(0);
      setResult(null);

      const initialTimeLeft = Math.max(0, Math.floor((newEndsAt - Date.now()) / 1000));
      setTimeLeft(initialTimeLeft);

      const { res: qRes, questions: fetchedQuestions } = await QuizService.fetchTryoutQuestionsFromApi(newExamId);
      if (!qRes.ok) throw new Error('Failed to fetch tryout questions');
      if (!fetchedQuestions.length) throw new Error('Empty tryout question set');
      setQuestions(fetchedQuestions);
    } catch (e: any) {
      console.error('TEAM_004 start tryout failed', e);
      alert('Gagal memuat soal tryout. Silakan coba lagi.');
      resetTryout();
    } finally {
      setIsLoading(false);
    }
  }, [resetTryout]);

  // TIMER LOGIC
  useEffect(() => {
    if (isStarted && !result && !isLoading && endsAt && questions.length > 0) {
      const timer = setInterval(() => {
        const newLeft = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
        setTimeLeft(newLeft);
        if (newLeft <= 0) {
          clearInterval(timer);
          void submitTryout();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, result, isLoading, questions.length, endsAt, submitTryout]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((optionId: string) => {
    if (!questions[currentIndex]) return;
    const qId = questions[currentIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
    // No auto-advance in Tryout mode to allow review
  }, [questions, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) return;
    if (shouldShowInterstitial(currentIndex, lastInterstitialAtIndex)) {
      const nextIndex = currentIndex + 1;
      setPendingIndex(nextIndex);
      setLastInterstitialAtIndex(currentIndex);
      setIsInterstitialOpen(true);
      return; // do NOT advance
    }
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, questions.length, lastInterstitialAtIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleJumpToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleMobileJump = useCallback((index: number) => {
      setCurrentIndex(index);
      setIsMobileGridOpen(false);
  }, []);

  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    return { answered, unread: total - answered, unanswered: 0 }; 
  }, [answers, questions.length]);

  const handleRetry = useCallback(() => {
    resetTryout();
    void startTryout();
  }, [resetTryout, startTryout]);

  const handleInterstitialClose = useCallback(() => {
    setIsInterstitialOpen(false);
    if (pendingIndex != null) {
      setCurrentIndex(pendingIndex);
      setPendingIndex(null);
    }
  }, [pendingIndex]);

  const generateImage = useCallback(async (): Promise<string | null> => {
    const node = cardRef.current;
    if (!node) return null;

    const t0 = performance.now();
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    console.info('[share_capture] preflight', {
      kind: 'tryout',
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
    if (!result) return;
    void (async () => {
      setShowShareModal(true);
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
  }, [generateImage, result]);

  const handleRetryGenerate = useCallback(() => {
    handleShareClick();
  }, [handleShareClick]);

  const shareData: TryoutShareData | null = result ? {
    kind: 'tryout',
    userName: 'User', // TODO: Get from user context
    totalScore: result.totalScore,
    twkScore: result.details.twk,
    tiuScore: result.details.tiu,
    tkpScore: result.details.tkp,
    passed: result.passed,
    correct: result.correctCount,
    total: result.totalQuestions,
    generatedAt: new Date().toISOString(),
    link: SHARE_LINK_TRYOUT,
  } : null;

  // --- RENDER ---

  if (!isStarted) {
    return (
      <div className="flex flex-col w-full animate-fade-in pb-20 md:pb-0">
         <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-80px)]">
             {/* Left: Main Action */}
             <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black bg-brand-purple flex flex-col justify-center relative overflow-hidden">
                 <div className="relative z-10">
                     <div className="inline-flex items-center gap-2 border border-black bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
                         <Clock className="w-3 h-3" />
                         Waktu Terbatas
                     </div>
                     <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
                         Tryout<br/>Akbar
                     </h1>
                     <p className="font-bold text-lg mb-8 max-w-md">
                         Simulasi skala penuh. 110 soal. 100 menit.
                         Uji diri Anda dengan antarmuka CAT standar BKN.
                     </p>
                     <Button size="lg" variant="black" withArrow onClick={startTryout}>
                         Mulai Simulasi
                     </Button>
                 </div>
                 <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-black opacity-10 rounded-full"></div>
             </div>
             {/* Right: Info */}
            <div className="flex flex-col bg-white">
              {/* Removed: schedule and participants sections until real data exists */}
              <div className="flex-1" />
            </div>
         </div>
      </div>
    );
  }

  // LOADING STATE
  if (isLoading) {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center space-y-4 font-sans">
            <Loader2 className="w-12 h-12 animate-spin text-brand-black" />
            <p className="font-bold text-lg animate-pulse">Menyiapkan Paket Soal...</p>
        </div>
    );
  }

  // SIMULATION VIEW (Overlay Mode)
  const currentQ = questions[currentIndex];
  // Safety check if loading failed or array empty
  if (!currentQ && !isLoading) return <div className="p-8">Gagal memuat soal. Silakan refresh.</div>;

  // TEAM_013: allow Tryout overlay to scroll on mobile only (desktop keeps fixed layout)
  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col font-sans overflow-y-auto md:overflow-hidden">
      
      {/* Interstitial Ad Overlay */}
      {isInterstitialOpen && (
        <InterstitialAd
          onClose={handleInterstitialClose}
          onGoPro={() => {
            // TODO: navigate to premium page or show upgrade modal
            console.log('Go to Premium from interstitial');
          }}
        />
      )}
      
      {/* RESULT MODAL */}
      {result && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-black animate-scale-in">
              <div className={`p-6 text-center border-b border-black ${result.passed ? 'bg-brand-lime' : 'bg-brand-pink'}`}>
                  {result.passed ? <Award className="w-12 h-12 mx-auto mb-2" /> : <XCircle className="w-12 h-12 mx-auto mb-2" />}
                  <h2 className="text-2xl font-black uppercase tracking-tight">{result.passed ? 'Lulus Passing Grade' : 'Belum Lulus'}</h2>
                  <p className="font-medium opacity-80">{result.passed ? 'Pertahankan performa ini!' : 'Jangan menyerah, coba lagi!'}</p>
              </div>
              <div className="p-6 bg-brand-cream">
                  <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-gray-500 uppercase text-xs">Total Skor</span>
                      <span className="font-black text-4xl">{result.totalScore}</span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TWK (Kebangsaan)</span>
                          <span className="font-black">{result.details.twk}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TIU (Intelegensia)</span>
                          <span className="font-black">{result.details.tiu}</span>
                      </div>
                       <div className="flex justify-between p-3 bg-white border border-black rounded">
                          <span className="font-bold text-sm">TKP (Pribadi)</span>
                          <span className="font-black">{result.details.tkp}</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <Button variant="outline" onClick={handleRetry}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Ulangi
                     </Button>
                     <Button variant="black" onClick={resetTryout}>
                        Tutup
                     </Button>
                  </div>
                  <div className="mt-3">
                     <Button onClick={handleShareClick} variant="outline" fullWidth>
                        <Share2 className="w-4 h-4 mr-2" /> Bagikan
                     </Button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Offscreen share card */}
      {shareData && (
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
          <TryoutShareCard data={shareData} />
        </div>
      )}

      {/* Share modal */}
      <ShareResultModal
        imageUrl={shareImageUrl}
        imageState={shareImageState}
        caption={SHARE_CAPTION}
        link={SHARE_LINK_TRYOUT}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onRetryGenerate={handleRetryGenerate}
      />

      {/* 1. Header */}
      <div className="bg-white border-b border-black shadow-sm h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-20">
         <h2 className="font-bold text-lg md:text-xl truncate mr-4">
            Tryout SKD
            <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">No. {currentIndex + 1}</span>
         </h2>
         <div className="text-xl md:text-2xl font-bold text-red-600 font-mono tracking-widest bg-red-50 px-3 py-1 rounded border border-red-100">
            {formatTime(timeLeft)}
         </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Column: Question Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
              
              {/* Reusing QuizCard for Content */}
              {/* TEAM_011: ensure QuizCard panes can scroll by keeping the wrapper flexible */}
              <div className="flex-1 relative border-b border-black md:border-b-0 min-h-0 overflow-hidden">
                  <QuizCard 
                      question={currentQ}
                      selectedOptionId={answers[currentQ.id]}
                      onSelectOption={handleAnswer}
                      questionIndex={currentIndex}
                      totalQuestions={questions.length}
                      hideSubjectLabel={true}
                  />
              </div>

              {/* Bottom Navigation Bar */}
              <div className="h-auto border-t border-black bg-white p-4 flex items-center justify-between shrink-0 z-10">
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex-1 md:flex-none justify-center px-4 py-2 rounded border border-black bg-gray-100 text-black font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={currentIndex === questions.length - 1}
                        className="flex-1 md:flex-none justify-center px-4 py-2 rounded border border-black bg-brand-lime text-black font-bold text-sm hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    <button 
                        onClick={() => setIsMobileGridOpen(true)}
                        className="md:hidden px-3 py-2 rounded border border-black bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                  </div>
              </div>
          </div>

          {/* Right Column: Navigation Grid (Desktop) */}
          <div className="hidden md:flex w-80 bg-white border-l border-black flex-col flex-shrink-0">
             <div className="p-4 border-b border-black bg-brand-cream">
                <h3 className="font-black text-sm uppercase tracking-wider">Navigasi Soal</h3>
             </div>
             
             <div className="p-4 flex-1 overflow-y-auto bg-gray-50">
                 <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => (
                        <GridItem 
                            key={q.id} 
                            index={idx} 
                            isActive={idx === currentIndex}
                            isAnswered={!!answers[q.id]}
                            onSelect={handleJumpToQuestion}
                        />
                    ))}
                 </div>
             </div>

             {/* Legend */}
             <div className="p-4 bg-white border-t border-black space-y-2 text-xs font-bold text-gray-600">
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded border border-black"></div> Terjawab</span>
                     <span>{stats.answered}</span>
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded border border-black"></div> Posisi Sekarang</span>
                     <span>-</span>
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 rounded border border-black"></div> Belum Dijawab</span>
                     <span>{stats.unread}</span>
                 </div>
             </div>
             
             {/* Submit Button (Desktop) */}
             <div className="p-4 border-t border-black bg-white">
                <SubmitButton onClick={submitTryout} />
             </div>
          </div>

      </div>

      {/* Mobile Grid Toggle & Drawer */}
      <div className="md:hidden">
          {/* Drawer Overlay */}
          {isMobileGridOpen && (
              <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex justify-end">
                  <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-black">
                      <div className="p-4 border-b border-black flex justify-between items-center bg-brand-cream">
                          <h3 className="font-black text-lg">Daftar Soal</h3>
                          <button onClick={() => setIsMobileGridOpen(false)} className="p-1 hover:bg-black hover:text-white rounded border border-transparent hover:border-black transition-colors">
                              <X className="w-6 h-6" />
                          </button>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                          <div className="grid grid-cols-5 gap-3">
                                {questions.map((q, idx) => (
                                    <GridItem 
                                        key={q.id} 
                                        index={idx} 
                                        isActive={idx === currentIndex}
                                        isAnswered={!!answers[q.id]}
                                        onSelect={handleMobileJump}
                                    />
                                ))}
                          </div>
                      </div>

                      {/* Submit Button (Mobile) */}
                      <div className="p-4 border-t border-black bg-white">
                         <SubmitButton onClick={submitTryout} />
                      </div>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};

export default TryoutView;